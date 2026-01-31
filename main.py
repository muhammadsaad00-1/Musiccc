from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
from typing import Optional
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to ensure storage bucket exists
def ensure_bucket_exists(bucket_name: str):
    """Create a storage bucket if it doesn't exist"""
    try:
        # Try to get bucket info - if it fails, bucket doesn't exist
        supabase.storage.get_bucket(bucket_name)
    except Exception:
        # Create the bucket with public access
        try:
            supabase.storage.create_bucket(bucket_name, options={"public": True})
            print(f"Created storage bucket: {bucket_name}")
        except Exception as e:
            # Bucket might already exist or other error
            print(f"Bucket creation note: {e}")

# Mount static files for frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve frontend pages
@app.get("/")
def read_root():
    return FileResponse("frontend/user/index.html")

@app.get("/admin")
def read_admin():
    return FileResponse("frontend/admin/admin.html")


# ============================================
# BOOKING REQUIREMENTS ENDPOINTS
# ============================================

@app.post("/api/submit-requirement")
async def submit_requirement(
    eventType: str = Form(...),
    eventDate: str = Form(...),
    eventLocation: str = Form(...),
    budget: str = Form(None),
    artistType: str = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    message: str = Form(None),
):
    """
    Submit a new booking requirement.
    Saves to database and sends email notification.
    """
    from datetime import datetime
    from email_service import send_requirement_notification
    
    try:
        # Prepare data for database
        requirement_data = {
            "event_type": eventType,
            "event_date": eventDate,
            "event_location": eventLocation,
            "budget": budget,
            "artist_type": artistType,
            "customer_name": name,
            "customer_email": email,
            "customer_phone": phone,
            "message": message,
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        
        # Save to database
        response = supabase.table("booking_requirements").insert(requirement_data).execute()
        
        if response.data:
            requirement_id = response.data[0]["id"]
            
            # Send email notification (async, don't block response)
            email_data = {
                "eventType": eventType,
                "eventDate": eventDate,
                "eventLocation": eventLocation,
                "budget": budget,
                "artistType": artistType,
                "name": name,
                "email": email,
                "phone": phone,
                "message": message
            }
            
            try:
                send_requirement_notification(email_data)
            except Exception as email_error:
                print(f"Email notification failed: {email_error}")
                # Don't fail the request if email fails
            
            return {
                "success": True,
                "message": "Requirement submitted successfully",
                "id": requirement_id
            }
        else:
            return {"success": False, "message": "Failed to save requirement"}
            
    except Exception as e:
        print(f"Error submitting requirement: {e}")
        # If table doesn't exist, provide helpful message
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            return {
                "success": False, 
                "message": "Database table 'booking_requirements' needs to be created. See setup instructions."
            }
        raise


@app.get("/api/requirements")
def get_requirements(status: str = None, limit: int = 50):
    """
    Get all booking requirements (for admin dashboard).
    Optionally filter by status: pending, contacted, booked, cancelled
    """
    try:
        query = supabase.table("booking_requirements").select("*").order("created_at", desc=True).limit(limit)
        
        if status:
            query = query.eq("status", status)
        
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Error fetching requirements: {e}")
        return []


@app.put("/api/requirements/{requirement_id}/status")
def update_requirement_status(requirement_id: str, status: str = Form(...)):
    """
    Update the status of a booking requirement.
    Status options: pending, contacted, booked, cancelled
    """
    try:
        response = supabase.table("booking_requirements").update({
            "status": status
        }).eq("id", requirement_id).execute()
        
        if response.data:
            return {"success": True, "message": "Status updated"}
        return {"success": False, "message": "Requirement not found"}
    except Exception as e:
        print(f"Error updating requirement status: {e}")
        raise


@app.post("/admin/performers")
async def create_performer(
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
    
    # Ensure bucket exists before uploading
    ensure_bucket_exists("performers")
    supabase.storage.from_("performers").upload(path, file_bytes)
    profile_image_url = supabase.storage.from_("performers").get_public_url(path)
    
    # Update performer with image URL
    supabase.table("performers").update({
        "profile_image_url": profile_image_url
    }).eq("id", performer_id).execute()

    return {"message": "Performer created", "id": performer_id}


@app.get("/performers")
def get_performers(category: str = None, city: str = None):
    try:
        query = supabase.table("performers").select("*")
        if category:
            query = query.eq("category", category)
        response = query.execute()
        
        # Filter by city if provided (since locations is an array)
        if city and response.data:
            response.data = [p for p in response.data if city in (p.get("locations") or [])]
        
        return response.data
    except Exception as e:
        raise


@app.get("/performers/cities")
def get_all_cities():
    """Get all unique cities/locations where performers are available"""
    try:
        response = supabase.table("performers").select("locations").execute()
        cities = set()
        for performer in response.data:
            if performer.get("locations"):
                cities.update(performer["locations"])
        return {"cities": sorted(list(cities))}
    except Exception as e:
        raise


@app.get("/performers/by-location/{location}")
def get_performers_by_location(location: str):
    """Get all performers available in a specific location/city"""
    try:
        response = supabase.table("performers").select("*").execute()
        # Filter performers that have this location in their locations array
        filtered_performers = [p for p in response.data if location in (p.get("locations") or [])]
        return filtered_performers
    except Exception as e:
        raise


@app.get("/performers/by-name/{name}")
def get_performer_by_name(name: str):
    """Get performer by name (slug format with hyphens)"""
    try:
        # Convert slug format (havi-abdur-rehman) to search format
        search_name = name.replace('-', ' ')
        
        # Get all performers and find match
        response = supabase.table("performers").select("*").execute()
        
        for performer in response.data:
            performer_name = performer.get("name", "").lower()
            # Check exact match or slug match
            performer_slug = performer_name.replace(' ', '-')
            if performer_name == search_name.lower() or performer_slug == name.lower():
                return performer
        
        return {"error": "Performer not found"}
    except Exception as e:
        raise


@app.get("/performers/{id}")
def get_performer(id: str):
    try:
        response = supabase.table("performers").select("*").eq("id", id).execute()
        if response.data:
            return response.data[0]
        return {"error": "Performer not found"}
    except Exception as e:
        raise


@app.get("/api/spotify/artist/{artist_name}")
async def get_artist_spotify_data(artist_name: str):
    """
    Fetch artist's discography and top songs from Spotify.
    Returns top tracks, albums, and artist metadata.
    """
    from spotify_api import get_artist_discography
    
    try:
        discography = await get_artist_discography(artist_name)
        return discography
    except Exception as e:
        print(f"Spotify API error: {e}")
        return {
            "found": False,
            "message": str(e),
            "topTracks": [],
            "albums": []
        }


@app.put("/admin/performers/{id}")
async def update_performer(
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
        
        # Ensure bucket exists before uploading
        ensure_bucket_exists("performers")
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("performers").upload(path, file_bytes, {"upsert": "true"})
        update_data["profile_image_url"] = supabase.storage.from_("performers").get_public_url(path)

    supabase.table("performers").update(update_data).eq("id", id).execute()
    return {"message": "Performer updated"}


@app.delete("/admin/performers/{id}")
def delete_performer(id: str):
    supabase.table("performers").delete().eq("id", id).execute()
    return {"message": "Performer deleted"}



@app.post("/admin/events")
async def create_event(
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
        "pricing": pricing,
        "performer_ids": performer_ids_list
    }).execute()
    
    event_id = insert_response.data[0]["id"]
    
    # Now upload image with proper naming: {id}_{sanitized_name}.{extension}
    file_bytes = await image.read()
    file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
    path = f"{event_id}_{sanitized_name}.{file_extension}"
    # Ensure bucket exists before uploading
    ensure_bucket_exists("events")
    supabase.storage.from_("events").upload(path, file_bytes)
    image_url = supabase.storage.from_("events").get_public_url(path)
    
    # Update event with image URL
    supabase.table("events").update({
        "image_url": image_url
    }).eq("id", event_id).execute()

    return {"message": "Event created", "id": event_id}


@app.get("/events")
def get_events():
    try:
        response = supabase.table("events").select("*, performers(*)").execute()
        events = []
        
        for event in response.data:
            events.append({
                "id": event["id"],
                "name": event["name"],
                "description": event["description"],
                "event_recommendations": event.get("event_recommendations"),
                "pricing": event["pricing"],
                "image_url": event.get("image_url"),
                "performer": event.get("performers"),
                "performer_id": event.get("performer_id")
            })
        
        return events
    except Exception as e:
        raise


@app.get("/events/{id}")
def get_event(id: str):
    try:
        response = supabase.table("events").select("*").eq("id", id).execute()
        if not response.data:
            return {"error": "Event not found"}
        
        event = response.data[0]
        
        # Fetch performer details for each performer ID in the array
        performers_details = []
        if event.get("performer_ids"):
            for performer_id in event["performer_ids"]:
                performer_response = supabase.table("performers").select("*").eq("id", performer_id).execute()
                if performer_response.data:
                    performers_details.append(performer_response.data[0])
        
        return {
            "id": event["id"],
            "name": event["name"],
            "description": event["description"],
            "event_recommendations": event.get("event_recommendations"),
            "pricing": event["pricing"],
            "image_url": event.get("image_url"),
            "performers": performers_details,
            "performer_ids": event.get("performer_ids", [])
        }
    except Exception as e:
        raise


@app.put("/admin/events/{event_id}")
async def update_event(
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
    if performer_ids:
        update_data["performer_ids"] = json.loads(performer_ids)
    
    if image:
        # Get event name for proper file naming
        event_response = supabase.table("events").select("name").eq("id", event_id).execute()
        event_name = event_response.data[0]["name"] if event_response.data else "event"
        
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', event_name.lower().replace(' ', '_'))
        path = f"{event_id}_{sanitized_name}.{file_extension}"
        
        # Ensure bucket exists before uploading
        ensure_bucket_exists("events")
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("events").upload(path, file_bytes, {"upsert": "true"})
        update_data["image_url"] = supabase.storage.from_("events").get_public_url(path)
    
    supabase.table("events").update(update_data).eq("id", event_id).execute()
    return {"message": "Event updated"}


@app.delete("/admin/events/{event_id}")
def delete_event(event_id: str):
    supabase.table("events").delete().eq("id", event_id).execute()
    return {"message": "Event deleted"}


@app.post("/api/submit-requirement")
async def submit_requirement(
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