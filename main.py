from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
from typing import Optional
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from cachetools import TTLCache
import hashlib

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize cache (maxsize=1000 items, TTL=300 seconds = 5 minutes)
cache = TTLCache(maxsize=1000, ttl=300)

# Helper function to generate cache keys
def get_cache_key(prefix: str, **kwargs) -> str:
    """Generate a unique cache key from prefix and parameters"""
    key_parts = [prefix] + [f"{k}:{v}" for k, v in sorted(kwargs.items()) if v is not None]
    key_string = "|".join(key_parts)
    return hashlib.md5(key_string.encode()).hexdigest()

# Cache invalidation helpers
def invalidate_performers_cache():
    """Invalidate all performer-related cache entries"""
    keys_to_remove = [k for k in cache.keys() if k.startswith(('performers_', 'cities_'))]
    for key in keys_to_remove:
        cache.pop(key, None)

def invalidate_events_cache():
    """Invalidate all event-related cache entries"""
    keys_to_remove = [k for k in cache.keys() if k.startswith('events_')]
    for key in keys_to_remove:
        cache.pop(key, None)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve frontend pages
@app.get("/")
@limiter.limit("60/minute")
def read_root(request: Request):
    return FileResponse("frontend/user/index.html")

@app.get("/admin")
@limiter.limit("30/minute")
def read_admin(request: Request):
    return FileResponse("frontend/admin/admin.html")


@app.post("/admin/performers")
@limiter.limit("10/minute")
async def create_performer(
    request: Request,
    name: str = Form(...),
    description: str = Form(None),
    category: str = Form(...),  # Singer, Comedian, DJ, Photography
    price: float = Form(None),
    instagram_url: str = Form(None),
    youtube_url: str = Form(None),
    locations: str = Form(None),  # JSON string of list
    genres: str = Form(None),  # JSON string of list
    videos: str = Form(None),  # JSON string of list of YouTube URLs
    image: UploadFile = File(...)
):
    import re
    
    # Parse JSON strings to lists
    locations_list = json.loads(locations) if locations else []
    genres_list = json.loads(genres) if genres else []
    videos_list = json.loads(videos) if videos else []

    # First, insert performer without image URL to get the generated UUID
    insert_response = supabase.table("performers").insert({
        "name": name,
        "description": description,
        "category": category,
        "price": price,
        "instagram_url": instagram_url,
        "youtube_url": youtube_url,
        "locations": locations_list,
        "genres": genres_list,
        "videos": videos_list
    }).execute()
    
    performer_id = insert_response.data[0]["id"]
    
    # Now upload image with proper naming: {id}_{sanitized_name}.{extension}
    file_bytes = await image.read()
    file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
    path = f"{performer_id}_{sanitized_name}.{file_extension}"
    
    supabase.storage.from_("performers").upload(path, file_bytes)
    profile_image_url = supabase.storage.from_("performers").get_public_url(path)
    
    # Update performer with image URL
    supabase.table("performers").update({
        "profile_image_url": profile_image_url
    }).eq("id", performer_id).execute()

    # Invalidate cache
    invalidate_performers_cache()

    return {"message": "Performer created", "id": performer_id}


@app.get("/performers")
@limiter.limit("100/minute")
def get_performers(request: Request, category: str = None, city: str = None):
    # Generate cache key
    cache_key = get_cache_key("performers", category=category, city=city)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        query = supabase.table("performers").select("*")
        if category:
            query = query.eq("category", category)
        response = query.execute()
        
        # Filter by city if provided (since locations is an array)
        if city and response.data:
            response.data = [p for p in response.data if city in (p.get("locations") or [])]
        
        # Store in cache
        cache[cache_key] = response.data
        
        return response.data
    except Exception as e:
        raise


@app.get("/performers/cities")
@limiter.limit("100/minute")
def get_all_cities(request: Request):
    """Get all unique cities/locations where performers are available"""
    cache_key = "cities_all"
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("performers").select("locations").execute()
        cities = set()
        for performer in response.data:
            if performer.get("locations"):
                cities.update(performer["locations"])
        
        result = {"cities": sorted(list(cities))}
        cache[cache_key] = result
        
        return result
    except Exception as e:
        raise


@app.get("/performers/by-location/{location}")
@limiter.limit("100/minute")
def get_performers_by_location(request: Request, location: str):
    """Get all performers available in a specific location/city"""
    cache_key = get_cache_key("performers_location", location=location)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("performers").select("*").execute()
        # Filter performers that have this location in their locations array
        filtered_performers = [p for p in response.data if location in (p.get("locations") or [])]
        
        cache[cache_key] = filtered_performers
        
        return filtered_performers
    except Exception as e:
        raise


@app.get("/performers/{id}")
@limiter.limit("100/minute")
def get_performer(request: Request, id: str):
    cache_key = get_cache_key("performers_id", id=id)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("performers").select("*").eq("id", id).execute()
        if response.data:
            result = response.data[0]
        else:
            result = {"error": "Performer not found"}
        
        cache[cache_key] = result
        
        return result
    except Exception as e:
        raise


@app.put("/admin/performers/{id}")
@limiter.limit("20/minute")
async def update_performer(
    request: Request,
    id: str,
    name: str = Form(None),
    description: str = Form(None),
    category: str = Form(None),
    price: float = Form(None),
    instagram_url: str = Form(None),
    youtube_url: str = Form(None),
    locations: str = Form(None),
    genres: str = Form(None),
    videos: str = Form(None),
    image: Optional[UploadFile] = File(None)
):
    import re
    
    update_data = {}
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if category:
        update_data["category"] = category
    if price is not None:
        update_data["price"] = price
    if instagram_url:
        update_data["instagram_url"] = instagram_url
    if youtube_url:
        update_data["youtube_url"] = youtube_url
    if locations:
        update_data["locations"] = json.loads(locations)
    if genres:
        update_data["genres"] = json.loads(genres)
    if videos:
        update_data["videos"] = json.loads(videos)
    
    if image:
        # Get performer name for proper file naming
        performer_response = supabase.table("performers").select("name").eq("id", id).execute()
        performer_name = performer_response.data[0]["name"] if performer_response.data else "performer"
        
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', performer_name.lower().replace(' ', '_'))
        path = f"{id}_{sanitized_name}.{file_extension}"
        
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("performers").upload(path, file_bytes, {"upsert": "true"})
        update_data["profile_image_url"] = supabase.storage.from_("performers").get_public_url(path)

    supabase.table("performers").update(update_data).eq("id", id).execute()
    
    # Invalidate cache
    invalidate_performers_cache()
    
    return {"message": "Performer updated"}


@app.delete("/admin/performers/{id}")
@limiter.limit("10/minute")
def delete_performer(request: Request, id: str):
    supabase.table("performers").delete().eq("id", id).execute()
    
    # Invalidate cache
    invalidate_performers_cache()
    
    return {"message": "Performer deleted"}



@app.post("/admin/events")
@limiter.limit("10/minute")
async def create_event(
    request: Request,
    name: str = Form(...),
    description: str = Form(None),
    event_recommendations: str = Form(None),
    pricing: float = Form(None),
    performer_ids: str = Form(None),  # JSON string of list of performer UUIDs
    image: UploadFile = File(...)
):
    import re
    
    # Parse JSON string to list of performer IDs
    performer_ids_list = json.loads(performer_ids) if performer_ids else []
    
    # First, insert event without image URL to get the generated UUID
    insert_response = supabase.table("events").insert({
        "name": name,
        "description": description,
        "event_recommendations": event_recommendations,
        "pricing": pricing
    }).execute()
    
    event_id = insert_response.data[0]["id"]
    
    # Insert performer associations into event_performers junction table
    if performer_ids_list:
        event_performer_rows = [
            {"event_id": event_id, "performer_id": performer_id}
            for performer_id in performer_ids_list
        ]
        supabase.table("event_performers").insert(event_performer_rows).execute()
    
    # Now upload image with proper naming: {id}_{sanitized_name}.{extension}
    file_bytes = await image.read()
    file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
    path = f"{event_id}_{sanitized_name}.{file_extension}"

    supabase.storage.from_("events").upload(path, file_bytes)
    image_url = supabase.storage.from_("events").get_public_url(path)
    
    # Update event with image URL
    supabase.table("events").update({
        "image_url": image_url
    }).eq("id", event_id).execute()

    # Invalidate cache
    invalidate_events_cache()

    return {"message": "Event created", "id": event_id}


@app.get("/events")
@limiter.limit("100/minute")
def get_events(request: Request):
    cache_key = "events_all"
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Get all events
        events_response = supabase.table("events").select("*").execute()
        events = []
        
        for event in events_response.data:
            # Get performers for this event through the junction table
            event_performers_response = supabase.table("event_performers").select(
                "performers(*)"
            ).eq("event_id", event["id"]).execute()
            
            performers = [ep["performers"] for ep in event_performers_response.data]
            
            events.append({
                "id": event["id"],
                "name": event["name"],
                "description": event["description"],
                "event_recommendations": event.get("event_recommendations"),
                "pricing": event["pricing"],
                "image_url": event.get("image_url"),
                "performers": performers
            })
        
        cache[cache_key] = events
        
        return events
    except Exception as e:
        raise


@app.get("/events/{id}")
@limiter.limit("100/minute")
def get_event(request: Request, id: str):
    cache_key = get_cache_key("events_id", id=id)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("events").select("*").eq("id", id).execute()
        if not response.data:
            return {"error": "Event not found"}
        
        event = response.data[0]
        
        # Fetch performers through the event_performers junction table
        event_performers_response = supabase.table("event_performers").select(
            "performer_id, performers(*)"
        ).eq("event_id", id).execute()
        
        performers_details = [ep["performers"] for ep in event_performers_response.data]
        performer_ids = [ep["performer_id"] for ep in event_performers_response.data]
        
        result = {
            "id": event["id"],
            "name": event["name"],
            "description": event["description"],
            "event_recommendations": event.get("event_recommendations"),
            "pricing": event["pricing"],
            "image_url": event.get("image_url"),
            "performers": performers_details,
            "performer_ids": performer_ids
        }
        
        cache[cache_key] = result
        
        return result
    except Exception as e:
        raise


@app.put("/admin/events/{event_id}")
@limiter.limit("20/minute")
async def update_event(
    request: Request,
    event_id: str,
    name: str = Form(None),
    description: str = Form(None),
    event_recommendations: str = Form(None),
    pricing: float = Form(None),
    performer_ids: str = Form(None),
    image: Optional[UploadFile] = File(None)
):
    import re
    
    update_data = {}
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if event_recommendations:
        update_data["event_recommendations"] = event_recommendations
    if pricing is not None:
        update_data["pricing"] = pricing
    
    # Handle performer associations through junction table
    if performer_ids:
        performer_ids_list = json.loads(performer_ids)
        # Delete existing associations
        supabase.table("event_performers").delete().eq("event_id", event_id).execute()
        # Insert new associations
        if performer_ids_list:
            event_performer_rows = [
                {"event_id": event_id, "performer_id": performer_id}
                for performer_id in performer_ids_list
            ]
            supabase.table("event_performers").insert(event_performer_rows).execute()
    
    if image:
        # Get event name for proper file naming
        event_response = supabase.table("events").select("name").eq("id", event_id).execute()
        event_name = event_response.data[0]["name"] if event_response.data else "event"
        
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', event_name.lower().replace(' ', '_'))
        path = f"{event_id}_{sanitized_name}.{file_extension}"
        
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("events").upload(path, file_bytes, {"upsert": "true"})
        update_data["image_url"] = supabase.storage.from_("events").get_public_url(path)
    
    if update_data:
        supabase.table("events").update(update_data).eq("id", event_id).execute()
    
    # Invalidate cache
    invalidate_events_cache()
    
    return {"message": "Event updated"}


@app.delete("/admin/events/{event_id}")
@limiter.limit("10/minute")
def delete_event(request: Request, event_id: str):
    supabase.table("events").delete().eq("id", event_id).execute()
    
    # Invalidate cache
    invalidate_events_cache()
    
    return {"message": "Event deleted"}


@app.post("/api/submit-requirement")
@limiter.limit("5/minute")
async def submit_requirement(
    request: Request,
    eventType: str = Form(...),
    eventDate: str = Form(...),
    eventLocation: str = Form(...),
    budget: str = Form(None),
    artistType: str = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    message: str = Form(None)
):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from datetime import datetime
    
    # Store requirement in database
    try:
        supabase.table("requirements").insert({
            "event_type": eventType,
            "event_date": eventDate,
            "event_location": eventLocation,
            "budget": budget,
            "artist_type": artistType,
            "customer_name": name,
            "customer_email": email,
            "customer_phone": phone,
            "message": message,
            "status": "pending"
        }).execute()
    except Exception as e:
        print(f"Database error: {e}")
    
    # Send confirmation email to customer
    try:
        # Email configuration (CHANGE THESE VALUES)
        SMTP_SERVER = "smtp.gmail.com"
        SMTP_PORT = 587
        SENDER_EMAIL = "your-email@gmail.com"  # Change this
        SENDER_PASSWORD = "your-app-password"  # Change this (use app password for Gmail)
        
        # Create email content
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Event Booking Request Received - We\'ll Get Back to You Soon!'
        msg['From'] = SENDER_EMAIL
        msg['To'] = email
        
        # HTML email body
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">Thank You for Your Request!</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p>Dear {name},</p>
                        
                        <p>Thank you for submitting your event requirement. We have received your request and our team will review it carefully.</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #f97316;">Your Request Details:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Event Type:</td>
                                    <td style="padding: 8px 0;">{eventType}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Event Date:</td>
                                    <td style="padding: 8px 0;">{eventDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                                    <td style="padding: 8px 0;">{eventLocation}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Artist Type:</td>
                                    <td style="padding: 8px 0;">{artistType}</td>
                                </tr>
                                {f'<tr><td style="padding: 8px 0; font-weight: bold;">Budget:</td><td style="padding: 8px 0;">{budget}</td></tr>' if budget else ''}
                            </table>
                        </div>
                        
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your requirements within 24 hours</li>
                            <li>We'll match you with the best available artists</li>
                            <li>You'll receive personalized recommendations via email</li>
                            <li>One of our coordinators will contact you on {phone}</li>
                        </ul>
                        
                        <p>If you have any urgent queries, feel free to reach out to us.</p>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;">
                            <p style="color: #666; font-size: 14px;">Best regards,<br><strong>The Event Team</strong></p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            
        return {
            "message": "Requirement submitted successfully",
            "email_sent": True
        }
        
    except Exception as e:
        print(f"Email error: {e}")
        return {
            "message": "Requirement submitted successfully",
            "email_sent": False,
            "email_error": str(e)
        }