from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase_functions import create_client
from supabase import create_client
from typing import Optional
import json
import re
import traceback
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from cachetools import TTLCache
import hashlib
from email_service import send_requirement_notification, send_contact_message
import os
from dotenv import load_dotenv

load_dotenv()  

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize cache (maxsize=1000 items, TTL=300 seconds = 5 minutes)
cache = TTLCache(maxsize=1000, ttl=300)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

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

def invalidate_reviews_cache():
    """Invalidate all review-related cache entries"""
    keys_to_remove = [k for k in cache.keys() if k.startswith('reviews_')]
    for key in keys_to_remove:
        cache.pop(key, None)

def invalidate_packages_cache():
    """Invalidate all package-related cache entries"""
    keys_to_remove = [k for k in cache.keys() if k.startswith('packages_')]
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

# Helper function to ensure storage bucket exists
def ensure_bucket_exists(bucket_name: str):
    """Create a storage bucket if it doesn't exist with public access"""
    try:
        # Try to get bucket info - if it fails, bucket doesn't exist
        supabase.storage.get_bucket(bucket_name)
        print(f"Bucket '{bucket_name}' already exists")
    except Exception as e:
        # Create the bucket with public access
        try:
            # Create bucket with public: true
            supabase.storage.create_bucket(
                bucket_name,
                options={"public": True, "file_size_limit": 52428800}  # 50MB limit
            )
            print(f"✅ Created storage bucket: {bucket_name}")
            
            # Set RLS policy to allow all operations (since we're using service_role key)
            # This is handled by the public: True option
            
        except Exception as create_error:
            error_str = str(create_error).lower()
            if "already exists" in error_str or "duplicate" in error_str:
                print(f"Bucket '{bucket_name}' already exists")
            elif "row-level security" in error_str or "403" in error_str or "unauthorized" in error_str:
                print(f"⚠️  Bucket '{bucket_name}' exists but has RLS restrictions.")
                print(f"   Go to: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/storage/buckets")
                print(f"   And make sure '{bucket_name}' bucket is set to PUBLIC")
                print(f"   Or run this SQL in SQL Editor to allow uploads:")
                print(f"   CREATE POLICY \"Allow service_role full access\" ON storage.objects FOR ALL TO service_role USING (bucket_id = '{bucket_name}') WITH CHECK (bucket_id = '{bucket_name}');")
            else:
                print(f"Bucket creation note: {create_error}")

# Mount static files for frontend
# app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve frontend pages
# @app.get("/")
# @limiter.limit("60/minute")
# def read_root(request: Request):
#     return FileResponse("frontend/user/index.html")

# @app.get("/admin")
# @limiter.limit("30/minute")
# def read_admin(request: Request):
#     return FileResponse("frontend/admin/admin.html")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Welcome to Musiccc API!"}

# ============================================
# ADMIN AUTHENTICATION ENDPOINTS
# ============================================

@app.post("/api/admin/login")
@limiter.limit("5/minute")
async def admin_login(request: Request):
    """
    Admin login using Supabase authentication.
    Validates credentials against Supabase Auth.
    """
    try:
        body = await request.json()
        email = body.get("email")
        password = body.get("password")
        
        if not email or not password:
            return {
                "success": False,
                "message": "Email and password are required"
            }
        
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if auth_response.user:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email,
                    "role": auth_response.user.role
                },
                "session": {
                    "access_token": auth_response.session.access_token,
                    "refresh_token": auth_response.session.refresh_token
                }
            }
        else:
            return {
                "success": False,
                "message": "Invalid credentials"
            }
            
    except Exception as e:
        print(f"Login error: {e}")
        return {
            "success": False,
            "message": str(e)
        }


@app.post("/api/admin/verify")
@limiter.limit("30/minute")
async def verify_admin_session(request: Request):
    """
    Verify admin session token.
    """
    try:
        body = await request.json()
        access_token = body.get("access_token")
        
        if not access_token:
            return {
                "success": False,
                "message": "Access token required"
            }
        
        # Verify token with Supabase
        user = supabase.auth.get_user(access_token)
        
        if user:
            return {
                "success": True,
                "user": {
                    "id": user.user.id,
                    "email": user.user.email
                }
            }
        else:
            return {
                "success": False,
                "message": "Invalid session"
            }
            
    except Exception as e:
        print(f"Verification error: {e}")
        return {
            "success": False,
            "message": "Session verification failed"
        }


@app.post("/api/admin/logout")
@limiter.limit("10/minute")
async def admin_logout(request: Request):
    """
    Admin logout - sign out from Supabase.
    """
    try:
        body = await request.json()
        access_token = body.get("access_token")
        
        if access_token:
            supabase.auth.sign_out(access_token)
        
        return {
            "success": True,
            "message": "Logged out successfully"
        }
    except Exception as e:
        print(f"Logout error: {e}")
        return {
            "success": True,
            "message": "Logged out"
        }


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
    event_name: str = Form("Custom"),
    package_id: str = Form(None),
    package_name: str = Form(None),
    artist_id: str = Form(None),
    artist_name: str = Form(None),
):
    """
    Submit a new booking requirement.
    Saves to database and sends email notification.
    """
    from datetime import datetime
    
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
            "event_name": event_name,
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        
        # Add package information if provided
        if package_id:
            requirement_data["package_id"] = package_id
        if package_name:
            requirement_data["package_name"] = package_name
        if artist_id:
            requirement_data["artist_id"] = artist_id
        if artist_name:
            requirement_data["artist_name"] = artist_name
        
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


# Alternative routes for admin panel (same functionality, different paths)
@app.get("/requirements")
def get_all_requirements(status: str = None, limit: int = 50):
    """Get all requirements (alias for admin panel)"""
    return get_requirements(status, limit)


@app.patch("/requirements/{requirement_id}/status")
async def patch_requirement_status(requirement_id: str, request: Request):
    """Update requirement status using PATCH (for admin panel)"""
    body = await request.json()
    status = body.get("status")
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


@app.delete("/requirements/{requirement_id}")
def delete_requirement(requirement_id: str):
    """Delete a booking requirement"""
    try:
        response = supabase.table("booking_requirements").delete().eq("id", requirement_id).execute()
        return {"success": True, "message": "Requirement deleted"}
    except Exception as e:
        print(f"Error deleting requirement: {e}")
        raise


@app.post("/admin/performers")
@limiter.limit("10/minute")
async def create_performer(
    request: Request,
    name: str = Form(...),
    description: str = Form(None),
    category: str = Form(...),  # JSON string of list, e.g. '["Singers","Bhangra Artists"]'
    instagram_url: str = Form(None),
    youtube_url: str = Form(None),
    genres: str = Form(None),  # JSON string of list
    videos: str = Form(None),  # JSON string of list of YouTube URLs
    popular_songs: str = Form(None),  # JSON string of list of popular songs
    image: UploadFile = File(...),
    header_image: UploadFile = File(None),
    gallery_images: list[UploadFile] = File(None)
):
    import re
    
    # Parse JSON strings to lists
    # Category can be a JSON array string or a plain category name
    try:
        category_list = json.loads(category) if category.startswith('[') else [category]
    except (json.JSONDecodeError, AttributeError):
        category_list = [category] if category else []
    
    genres_list = json.loads(genres) if genres else []
    videos_list = json.loads(videos) if videos else []
    popular_songs_list = json.loads(popular_songs) if popular_songs else []

    # First, insert performer without image URLs to get the generated UUID
    insert_response = supabase.table("performers").insert({
        "name": name,
        "description": description,
        "category": category_list,
        "instagram_url": instagram_url,
        "youtube_url": youtube_url,
        "genres": genres_list,
        "videos": videos_list,
        "popular_songs": popular_songs_list
    }).execute()
    
    performer_id = insert_response.data[0]["id"]
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
    
    # Ensure bucket exists before uploading
    ensure_bucket_exists("performers")
    
    # Upload profile image
    try:
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        profile_path = f"{performer_id}_{sanitized_name}.{file_extension}"
        
        # Upload file with upsert enabled
        upload_response = supabase.storage.from_("performers").upload(
            profile_path, 
            file_bytes,
            file_options={"upsert": "true"}
        )
        profile_image_url = supabase.storage.from_("performers").get_public_url(profile_path)
        
        update_data = {"profile_image_url": profile_image_url}
    except Exception as upload_error:
        print(f"❌ Upload error: {upload_error}")
        error_str = str(upload_error).lower()
        if "403" in error_str or "unauthorized" in error_str or "row-level security" in error_str:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Storage upload failed due to RLS policy. "
                "Please go to Supabase Dashboard > Storage > 'performers' bucket > "
                "Click 'Edit bucket' and enable 'Public bucket' option. "
                "Or add RLS policies to allow service_role access."
            )
        )
        raise
    
    # Upload header image if provided
    if header_image:
        header_bytes = await header_image.read()
        header_extension = header_image.filename.split('.')[-1] if '.' in header_image.filename else 'jpg'
        header_path = f"{performer_id}_{sanitized_name}_header.{header_extension}"
        supabase.storage.from_("performers").upload(
            header_path, 
            header_bytes,
            file_options={"upsert": "true"}
        )
        header_image_url = supabase.storage.from_("performers").get_public_url(header_path)
        update_data["header_image_url"] = header_image_url
    
    # Upload gallery images if provided
    if gallery_images:
        gallery_urls = []
        for idx, gallery_image in enumerate(gallery_images):
            gallery_bytes = await gallery_image.read()
            gallery_extension = gallery_image.filename.split('.')[-1] if '.' in gallery_image.filename else 'jpg'
            gallery_path = f"{performer_id}_{sanitized_name}_gallery_{idx}.{gallery_extension}"
            supabase.storage.from_("performers").upload(
                gallery_path, 
                gallery_bytes,
                file_options={"upsert": "true"}
            )
            gallery_url = supabase.storage.from_("performers").get_public_url(gallery_path)
            gallery_urls.append(gallery_url)
        update_data["gallery_image_urls"] = gallery_urls
    
    # Update performer with image URLs
    supabase.table("performers").update(update_data).eq("id", performer_id).execute()

    # Invalidate cache
    invalidate_performers_cache()

    return {"message": "Performer created", "id": performer_id}


@app.get("/performers")
@limiter.limit("100/minute")
def get_performers(request: Request, category: str = None):
    # Generate cache key
    cache_key = get_cache_key("performers", category=category)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        query = supabase.table("performers").select("*")
        if category:
            query = query.contains("category", [category])
        response = query.execute()
        
        # Store in cache
        cache[cache_key] = response.data
        
        return response.data
    except Exception as e:
        raise


@app.get("/performers/cities")
@limiter.limit("100/minute")
def get_all_cities(request: Request):
    """Get all unique cities/locations where performers are available"""
    return {"cities": []}



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


@app.get("/api/youtube/artist/{artist_name}")
async def get_artist_youtube_data(artist_name: str, max_results: int = 5):
    """
    Fetch artist's top songs from YouTube.
    Returns top videos/songs for the artist.
    """
    try:
        # Using youtube-search-python package
        from youtube_search import YoutubeSearch
        
        search_query = f"{artist_name} top songs"
        results = YoutubeSearch(search_query, max_results=max_results).to_dict()
        
        top_songs = []
        for idx, video in enumerate(results):
            # Handle the case where video might be a string or dict
            if isinstance(video, dict):
                video_id = video.get('id', '')
                # Extract thumbnail URL safely
                thumbnails = video.get('thumbnails', [])
                thumbnail_url = None
                if thumbnails and len(thumbnails) > 0:
                    if isinstance(thumbnails[0], dict):
                        thumbnail_url = thumbnails[0].get('url')
                    elif isinstance(thumbnails[0], str):
                        thumbnail_url = thumbnails[0]
                
                top_songs.append({
                    "id": idx + 1,
                    "name": video.get('title', 'Unknown'),
                    "videoId": video_id,
                    "thumbnail": thumbnail_url or f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg",
                    "duration": video.get('duration', 'N/A'),
                    "views": video.get('views', 'N/A'),
                    "url": f"https://www.youtube.com/watch?v={video_id}"
                })
        
        return {
            "found": len(top_songs) > 0,
            "artist": artist_name,
            "topSongs": top_songs,
            "source": "youtube"
        }
    except ImportError:
        # Fallback if youtube-search not installed
        return {
            "found": False,
            "message": "YouTube search package not installed. Run: pip install youtube-search",
            "topSongs": []
        }
    except Exception as e:
        import traceback
        print(f"YouTube API error: {e}")
        print(traceback.format_exc())
        return {
            "found": False,
            "message": str(e),
            "topSongs": []
        }




@app.put("/admin/performers/{id}")
@limiter.limit("20/minute")
async def update_performer(
    request: Request,
    id: str,
    name: str = Form(None),
    description: str = Form(None),
    category: str = Form(None),
    instagram_url: str = Form(None),
    youtube_url: str = Form(None),
    genres: str = Form(None),
    videos: str = Form(None),
    popular_songs: str = Form(None),
    image: Optional[UploadFile] = File(None),
    header_image: Optional[UploadFile] = File(None),
    gallery_images: Optional[list[UploadFile]] = File(None)
):
    import re
    
    update_data = {}
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if category:
        try:
            # Parse JSON string if it's a list, otherwise simplify
            update_data["category"] = json.loads(category) if category.startswith('[') else [category]
        except (json.JSONDecodeError, AttributeError):
            update_data["category"] = [category]
    if youtube_url:
        update_data["youtube_url"] = youtube_url
    if genres:
        update_data["genres"] = json.loads(genres)
    if videos:
        update_data["videos"] = json.loads(videos)
    if popular_songs:
        update_data["popular_songs"] = json.loads(popular_songs)
    
    # Get performer name for proper file naming
    performer_response = supabase.table("performers").select("name").eq("id", id).execute()
    performer_name = performer_response.data[0]["name"] if performer_response.data else "performer"
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', performer_name.lower().replace(' ', '_'))
    
    # Ensure bucket exists before uploading
    ensure_bucket_exists("performers")
    
    if image and image.filename:
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        path = f"{id}_{sanitized_name}.{file_extension}"
        
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("performers").upload(
            path, 
            file_bytes, 
            file_options={"upsert": "true"}
        )
        update_data["profile_image_url"] = supabase.storage.from_("performers").get_public_url(path)
    
    if header_image and header_image.filename:
        header_bytes = await header_image.read()
        header_extension = header_image.filename.split('.')[-1] if '.' in header_image.filename else 'jpg'
        header_path = f"{id}_{sanitized_name}_header.{header_extension}"
        
        supabase.storage.from_("performers").upload(
            header_path, 
            header_bytes, 
            file_options={"upsert": "true"}
        )
        update_data["header_image_url"] = supabase.storage.from_("performers").get_public_url(header_path)
    
    if gallery_images and len(gallery_images) > 0:
        # Check if actual files were uploaded (not empty file list)
        if gallery_images[0].filename:
            gallery_urls = []
            for idx, gallery_image in enumerate(gallery_images):
                gallery_bytes = await gallery_image.read()
                gallery_extension = gallery_image.filename.split('.')[-1] if '.' in gallery_image.filename else 'jpg'
                gallery_path = f"{id}_{sanitized_name}_gallery_{idx}.{gallery_extension}"
                
                supabase.storage.from_("performers").upload(
                    gallery_path, 
                    gallery_bytes, 
                    file_options={"upsert": "true"}
                )
                gallery_url = supabase.storage.from_("performers").get_public_url(gallery_path)
                gallery_urls.append(gallery_url)
            update_data["gallery_image_urls"] = gallery_urls

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
    
    # Now upload header image with proper naming: {id}_{sanitized_name}.{extension}
    try:
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
        path = f"{event_id}_{sanitized_name}_header.{file_extension}"
        
        # Ensure bucket exists before uploading
        ensure_bucket_exists("events")
        
        # Upload file with upsert enabled
        upload_response = supabase.storage.from_("events").upload(
            path, 
            file_bytes,
            file_options={"upsert": "true"}
        )
        header_image_url = supabase.storage.from_("events").get_public_url(path)
        
    except Exception as upload_error:
        print(f"❌ Event image upload error: {upload_error}")
        error_str = str(upload_error).lower()
        if "403" in error_str or "unauthorized" in error_str or "row-level security" in error_str:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Storage upload failed due to RLS policy. "
                "Please go to Supabase Dashboard > Storage > 'events' bucket > "
                "Click 'Edit bucket' and enable 'Public bucket' option. "
                "URL: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/storage/buckets"
            )
        )
        raise
    
    # Update event with header image URL
    supabase.table("events").update({
        "header_image_url": header_image_url
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
                "header_image_url": event.get("header_image_url"),
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
            "header_image_url": event.get("header_image_url"),
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
        path = f"{event_id}_{sanitized_name}_header.{file_extension}"
        
        # Ensure bucket exists before uploading
        ensure_bucket_exists("events")
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("events").upload(path, file_bytes, {"upsert": "true"})
        update_data["header_image_url"] = supabase.storage.from_("events").get_public_url(path)
    
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


# ============================================
# CATEGORY ENDPOINTS
# ============================================

@app.get("/categories")
@limiter.limit("100/minute")
def get_categories(request: Request):
    """
    Get all categories with artist counts.
    """
    cache_key = "categories_all"
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Get all categories
        response = supabase.table("categories").select("*").execute()
        categories = response.data
        
        # Calculate artist counts for each category
        # This might be expensive if we have many categories, 
        # but for now it's fine as categories are usually few (< 20)
        for category in categories:
            # Count performers in this category
            # Note: storing category name in performers table is not ideal normalization,
            # but that's how the current schema seems to work based on create_performer
            count_response = supabase.table("performers").select("id", count="exact").contains("category", [category["name"]]).execute()
            category["artist_count"] = count_response.count
            
        cache[cache_key] = categories
        return categories
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return []

@app.post("/admin/categories")
@limiter.limit("10/minute")
async def create_category(
    request: Request,
    name: str = Form(...),
    description: str = Form(None),
    image: UploadFile = File(None)
):
    import re
    
    try:
        slug = re.sub(r'[^a-zA-Z0-9-]', '-', name.lower())
        
        category_data = {
            "name": name,
            "slug": slug,
            "description": description
        }
        
        # Insert category first
        response = supabase.table("categories").insert(category_data).execute()
        
        if not response.data:
            return {"success": False, "message": "Failed to create category"}
            
        category_id = response.data[0]["id"]
        
        # Handle image upload if provided
        if image:
            try:
                file_bytes = await image.read()
                file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
                file_path = f"category_{category_id}.{file_extension}"
                
                ensure_bucket_exists("categories")
                
                supabase.storage.from_("categories").upload(file_path, file_bytes, {"upsert": "true"})
                image_url = supabase.storage.from_("categories").get_public_url(file_path)
                
                # Update category with image url
                supabase.table("categories").update({"image_url": image_url}).eq("id", category_id).execute()
                
            except Exception as upload_error:
                print(f"Category image upload error: {upload_error}")
                # Continue even if image upload fails
        
        # Invalidate cache
        if "categories_all" in cache:
            del cache["categories_all"]
            
        return {"success": True, "message": "Category created", "data": response.data[0]}
        
    except Exception as e:
        print(f"Error creating category: {e}")
        raise

@app.put("/admin/categories/{id}")
@limiter.limit("10/minute")
async def update_category(
    request: Request,
    id: str,
    name: str = Form(None),
    description: str = Form(None),
    image: UploadFile = File(None)
):
    import re
    
    try:
        update_data = {}
        if name:
            update_data["name"] = name
            update_data["slug"] = re.sub(r'[^a-zA-Z0-9-]', '-', name.lower())
        if description:
            update_data["description"] = description
            
        if update_data:
            supabase.table("categories").update(update_data).eq("id", id).execute()
            
        if image:
            try:
                file_bytes = await image.read()
                file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
                file_path = f"category_{id}.{file_extension}"
                
                ensure_bucket_exists("categories")
                
                supabase.storage.from_("categories").upload(file_path, file_bytes, {"upsert": "true"})
                image_url = supabase.storage.from_("categories").get_public_url(file_path)
                
                supabase.table("categories").update({"image_url": image_url}).eq("id", id).execute()
            except Exception as upload_error:
                print(f"Category image upload error: {upload_error}")
        
        # Invalidate cache
        if "categories_all" in cache:
            del cache["categories_all"]
            
        return {"success": True, "message": "Category updated"}
        
    except Exception as e:
        print(f"Error updating category: {e}")
        raise

@app.delete("/admin/categories/{id}")
@limiter.limit("10/minute")
def delete_category(request: Request, id: str):
    try:
        supabase.table("categories").delete().eq("id", id).execute()
        
        # Invalidate cache
        if "categories_all" in cache:
            del cache["categories_all"]
            
        return {"success": True, "message": "Category deleted"}
    except Exception as e:
        print(f"Error deleting category: {e}")
        raise


# ============================================
# BLOG ENDPOINTS
# ============================================

@app.get("/blogs")
@limiter.limit("100/minute")
def get_blogs(request: Request, limit: int = 50, category: str = None):
    """
    Get all blog posts with optional filtering by category.
    Returns published posts sorted by date (newest first).
    """
    cache_key = f"blogs_{limit}_{category}"
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        query = supabase.table("blogs").select("*")
        
        # Filter by category if provided
        if category:
            query = query.eq("category", category)
        
        # Only get published posts, ordered by date
        query = query.eq("is_published", True).order("created_at", desc=True).limit(limit)
        
        response = query.execute()
        blogs = response.data
        
        cache[cache_key] = blogs
        return blogs
    except Exception as e:
        print(f"Error fetching blogs: {e}")
        return []

@app.get("/blogs/{id}")
@limiter.limit("100/minute")
def get_blog(request: Request, id: str):
    """
    Get a single blog post by ID or slug.
    """
    import re
    
    # Check if id follows UUID format
    is_uuid = False
    if len(id) == 36:
        uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
        if uuid_pattern.match(id):
            is_uuid = True
            
    try:
        if is_uuid:
            # Try to get by ID
            response = supabase.table("blogs").select("*").eq("id", id).eq("is_published", True).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        
        # Try by slug
        response = supabase.table("blogs").select("*").eq("slug", id).eq("is_published", True).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Blog post not found"}
    except Exception as e:
        print(f"Error fetching blog: {e}")
        return {"error": str(e)}

@app.post("/admin/blogs")
@limiter.limit("10/minute")
async def create_blog(
    request: Request,
    title: str = Form(...),
    slug: str = Form(None),
    excerpt: str = Form(None),
    content: str = Form(...),
    category: str = Form(None),
    author: str = Form("Artist Factory Team"),
    image: UploadFile = File(None),
    is_published: bool = Form(False)
):
    """
    Create a new blog post.
    """
    import re
    from datetime import datetime
    
    try:
        # Generate slug from title if not provided
        if not slug:
            slug = re.sub(r'[^a-zA-Z0-9-]', '-', title.lower()).strip('-')
            # Remove multiple consecutive dashes
            slug = re.sub(r'-+', '-', slug)
        
        # Check if slug already exists
        existing = supabase.table("blogs").select("id").eq("slug", slug).execute()
        if existing.data and len(existing.data) > 0:
            slug = f"{slug}-{datetime.now().strftime('%Y%m%d')}"
        
        blog_data = {
            "title": title,
            "slug": slug,
            "excerpt": excerpt or title[:150],
            "content": content,
            "category": category or "General",
            "author": author,
            "is_published": is_published,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Insert blog first
        response = supabase.table("blogs").insert(blog_data).execute()
        
        if not response.data:
            return {"success": False, "message": "Failed to create blog post"}
        
        blog_id = response.data[0]["id"]
        
        # Handle image upload if provided
        if image:
            try:
                file_bytes = await image.read()
                file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
                file_path = f"blog_{blog_id}.{file_extension}"
                
                ensure_bucket_exists("blogs")
                
                supabase.storage.from_("blogs").upload(file_path, file_bytes, {"upsert": "true"})
                image_url = supabase.storage.from_("blogs").get_public_url(file_path)
                
                # Update blog with image URL
                supabase.table("blogs").update({"image_url": image_url}).eq("id", blog_id).execute()
                
            except Exception as upload_error:
                print(f"Blog image upload error: {upload_error}")
                # Continue even if image upload fails
        
        # Invalidate cache
        cache_keys_to_remove = [k for k in cache.keys() if k.startswith('blogs_')]
        for key in cache_keys_to_remove:
            cache.pop(key, None)
        
        return {"success": True, "message": "Blog post created", "data": response.data[0]}
        
    except Exception as e:
        print(f"Error creating blog: {e}")
        raise

@app.put("/admin/blogs/{id}")
@limiter.limit("10/minute")
async def update_blog(
    request: Request,
    id: str,
    title: str = Form(None),
    slug: str = Form(None),
    excerpt: str = Form(None),
    content: str = Form(None),
    category: str = Form(None),
    author: str = Form(None),
    image: UploadFile = File(None),
    is_published: bool = Form(None)
):
    """
    Update an existing blog post.
    """
    from datetime import datetime
    import re
    
    try:
        update_data = {}
        if title:
            update_data["title"] = title
        if slug:
            # Clean slug
            slug = re.sub(r'[^a-zA-Z0-9-]', '-', slug.lower()).strip('-')
            slug = re.sub(r'-+', '-', slug)
            update_data["slug"] = slug
        if excerpt:
            update_data["excerpt"] = excerpt
        if content:
            update_data["content"] = content
        if category:
            update_data["category"] = category
        if author:
            update_data["author"] = author
        if is_published is not None:
            update_data["is_published"] = is_published
        
        update_data["updated_at"] = datetime.now().isoformat()
        
        if update_data:
            supabase.table("blogs").update(update_data).eq("id", id).execute()
        
        if image:
            try:
                file_bytes = await image.read()
                file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
                file_path = f"blog_{id}.{file_extension}"
                
                ensure_bucket_exists("blogs")
                
                supabase.storage.from_("blogs").upload(file_path, file_bytes, {"upsert": "true"})
                image_url = supabase.storage.from_("blogs").get_public_url(file_path)
                
                supabase.table("blogs").update({"image_url": image_url}).eq("id", id).execute()
            except Exception as upload_error:
                print(f"Blog image upload error: {upload_error}")
        
        # Invalidate cache
        cache_keys_to_remove = [k for k in cache.keys() if k.startswith('blogs_')]
        for key in cache_keys_to_remove:
            cache.pop(key, None)
        
        return {"success": True, "message": "Blog post updated"}
        
    except Exception as e:
        print(f"Error updating blog: {e}")
        raise

@app.delete("/admin/blogs/{id}")
@limiter.limit("10/minute")
def delete_blog(request: Request, id: str):
    """
    Delete a blog post.
    """
    try:
        supabase.table("blogs").delete().eq("id", id).execute()
        
        # Invalidate cache
        cache_keys_to_remove = [k for k in cache.keys() if k.startswith('blogs_')]
        for key in cache_keys_to_remove:
            cache.pop(key, None)
        
        return {"success": True, "message": "Blog post deleted"}
    except Exception as e:
        print(f"Error deleting blog: {e}")
        raise


@app.post("/admin/packages")
@limiter.limit("10/minute")
async def create_package(
    request: Request,
    name: str = Form(...),
    description: str = Form(None),
    event_type: str = Form(...),
    pricing: float = Form(...),
    features: str = Form(None),  # JSON string of list
    duration: str = Form(None),
    max_guests: int = Form(None),
    performer_ids: str = Form(None),  # JSON string of list of performer UUIDs
    image: UploadFile = File(...)
):
    """Create a new package with performers and header image"""
    import re
    
    # Parse JSON strings to lists
    features_list = json.loads(features) if features else []
    performer_ids_list = json.loads(performer_ids) if performer_ids else []
    
    # First, insert package without image URL to get the generated UUID
    insert_response = supabase.table("packages").insert({
        "name": name,
        "description": description,
        "event_type": event_type,
        "pricing": pricing,
        "features": features_list,
        "duration": duration,
        "max_guests": max_guests,
        "is_active": True
    }).execute()
    
    package_id = insert_response.data[0]["id"]
    
    # Insert performer associations into package_performers junction table
    if performer_ids_list:
        package_performer_rows = [
            {"package_id": package_id, "performer_id": performer_id}
            for performer_id in performer_ids_list
        ]
        supabase.table("package_performers").insert(package_performer_rows).execute()
    
    # Upload header image
    file_bytes = await image.read()
    file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name.lower().replace(' ', '_'))
    path = f"{package_id}_{sanitized_name}_header.{file_extension}"
    
    # Ensure bucket exists before uploading
    ensure_bucket_exists("packages")
    supabase.storage.from_("packages").upload(path, file_bytes)
    header_image_url = supabase.storage.from_("packages").get_public_url(path)
    
    # Update package with header image URL
    supabase.table("packages").update({
        "header_image_url": header_image_url
    }).eq("id", package_id).execute()
    
    # Invalidate cache
    invalidate_packages_cache()
    
    return {"message": "Package created", "id": package_id}


@app.get("/packages")
@limiter.limit("100/minute")
def get_packages(request: Request, event_type: str = None, is_active: bool = None):
    """Get all packages with their associated performers"""
    cache_key = get_cache_key("packages_all", event_type=event_type, is_active=is_active)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Get all packages
        query = supabase.table("packages").select("*")
        
        if event_type:
            query = query.eq("event_type", event_type)
        
        if is_active is not None:
            query = query.eq("is_active", is_active)
        
        packages_response = query.execute()
        packages = []
        
        for package in packages_response.data:
            # Get performers for this package through the junction table
            package_performers_response = supabase.table("package_performers").select(
                "performers(*)"
            ).eq("package_id", package["id"]).execute()
            
            performers = [pp["performers"] for pp in package_performers_response.data]
            
            packages.append({
                "id": package["id"],
                "name": package["name"],
                "description": package["description"],
                "event_type": package["event_type"],
                "pricing": package["pricing"],
                "features": package.get("features", []),
                "duration": package.get("duration"),
                "max_guests": package.get("max_guests"),
                "header_image_url": package.get("header_image_url"),
                "is_active": package.get("is_active", True),
                "created_at": package.get("created_at"),
                "performers": performers
            })
        
        cache[cache_key] = packages
        
        return packages
    except Exception as e:
        raise


@app.get("/packages/{id}")
@limiter.limit("100/minute")
def get_package(request: Request, id: str):
    """Get a single package with performers"""
    cache_key = get_cache_key("packages_id", id=id)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("packages").select("*").eq("id", id).execute()
        if not response.data:
            return {"error": "Package not found"}
        
        package = response.data[0]
        
        # Fetch performers through the package_performers junction table
        package_performers_response = supabase.table("package_performers").select(
            "performer_id, performers(*)"
        ).eq("package_id", id).execute()
        
        performers_details = [pp["performers"] for pp in package_performers_response.data]
        performer_ids = [pp["performer_id"] for pp in package_performers_response.data]
        
        result = {
            "id": package["id"],
            "name": package["name"],
            "description": package["description"],
            "event_type": package["event_type"],
            "pricing": package["pricing"],
            "features": package.get("features", []),
            "duration": package.get("duration"),
            "max_guests": package.get("max_guests"),
            "header_image_url": package.get("header_image_url"),
            "is_active": package.get("is_active", True),
            "created_at": package.get("created_at"),
            "performers": performers_details,
            "performer_ids": performer_ids
        }
        
        cache[cache_key] = result
        
        return result
    except Exception as e:
        raise


@app.put("/admin/packages/{package_id}")
@limiter.limit("20/minute")
async def update_package(
    request: Request,
    package_id: str,
    name: str = Form(None),
    description: str = Form(None),
    event_type: str = Form(None),
    pricing: float = Form(None),
    features: str = Form(None),
    duration: str = Form(None),
    max_guests: int = Form(None),
    is_active: bool = Form(None),
    performer_ids: str = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """Update a package"""
    import re
    
    update_data = {}
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if event_type:
        update_data["event_type"] = event_type
    if pricing is not None:
        update_data["pricing"] = pricing
    if features:
        update_data["features"] = json.loads(features)
    if duration:
        update_data["duration"] = duration
    if max_guests is not None:
        update_data["max_guests"] = max_guests
    if is_active is not None:
        update_data["is_active"] = is_active
    
    # Handle performer associations through junction table
    if performer_ids:
        performer_ids_list = json.loads(performer_ids)
        # Delete existing associations
        supabase.table("package_performers").delete().eq("package_id", package_id).execute()
        # Insert new associations
        if performer_ids_list:
            package_performer_rows = [
                {"package_id": package_id, "performer_id": performer_id}
                for performer_id in performer_ids_list
            ]
            supabase.table("package_performers").insert(package_performer_rows).execute()
    
    if image and image.filename:
        # Get package name for proper file naming
        package_response = supabase.table("packages").select("name").eq("id", package_id).execute()
        package_name = package_response.data[0]["name"] if package_response.data else "package"
        
        file_bytes = await image.read()
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', package_name.lower().replace(' ', '_'))
        path = f"{package_id}_{sanitized_name}_header.{file_extension}"
        
        # Ensure bucket exists before uploading
        ensure_bucket_exists("packages")
        # Upload with upsert option to overwrite if exists
        supabase.storage.from_("packages").upload(path, file_bytes, {"upsert": "true"})
        update_data["header_image_url"] = supabase.storage.from_("packages").get_public_url(path)
    
    if update_data:
        supabase.table("packages").update(update_data).eq("id", package_id).execute()
    
    # Invalidate cache
    invalidate_packages_cache()
    
    return {"message": "Package updated"}


@app.delete("/admin/packages/{package_id}")
@limiter.limit("10/minute")
def delete_package(request: Request, package_id: str):
    """Delete a package"""
    supabase.table("packages").delete().eq("id", package_id).execute()
    
    # Invalidate cache
    invalidate_packages_cache()
    
    return {"message": "Package deleted"}


# ============================================
# REVIEWS ENDPOINTS
# ============================================

@app.get("/api/reviews")
@limiter.limit("100/minute")
def get_reviews(request: Request, limit: int = 50):
    """
    Get all reviews ordered by creation date (newest first).
    """
    cache_key = get_cache_key("reviews_all", limit=limit)
    
    # Check cache
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        response = supabase.table("reviews").select("*").order("created_at", desc=True).limit(limit).execute()
        result = response.data
        
        # Store in cache
        cache[cache_key] = result
        
        return result
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        raise


@app.post("/api/reviews")
@limiter.limit("5/minute")
async def submit_review(
    request: Request,
    user_name: str = Form(...),
    rating: int = Form(...),
    review: str = Form(None)
):
    """
    Submit a new review.
    Validates that rating is between 1 and 5.
    """
    try:
        # Validate rating
        if rating < 1 or rating > 5:
            return {
                "success": False,
                "message": "Rating must be between 1 and 5"
            }
        
        # Validate user_name is not empty
        if not user_name or not user_name.strip():
            return {
                "success": False,
                "message": "User name is required"
            }
        
        # Prepare data for database
        review_data = {
            "user_name": user_name.strip(),
            "rating": rating,
            "review": review.strip() if review else None
        }
        
        # Save to database
        response = supabase.table("reviews").insert(review_data).execute()
        
        if response.data:
            review_id = response.data[0]["id"]
            
            # Invalidate cache
            invalidate_reviews_cache()
            
            return {
                "success": True,
                "message": "Review submitted successfully",
                "id": review_id
            }
        else:
            return {"success": False, "message": "Failed to save review"}
            
    except Exception as e:
        print(f"Error submitting review: {e}")
        # If table doesn't exist, provide helpful message
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            return {
                "success": False, 
                "message": "Database table 'reviews' needs to be created. See setup instructions."
            }
        raise


# ============================================
# STATS ENDPOINT
# ============================================

@app.get("/api/stats")
async def get_stats():
    """
    Get application statistics: total artists, total events, etc.
    """
    try:
        # Get total artists from performers table
        performers_count = supabase.table("performers").select("*", count="exact").execute()
        total_artists = performers_count.count if hasattr(performers_count, 'count') else 0
        
        # Return statistics
        return {
            "total_artists": total_artists,
            "total_events": 362, # Fixed number as requested
            "total_cities": 20,
            "average_rating": 4.9
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {
            "total_artists": 200,
            "total_events": 362,
            "total_cities": 20,
            "average_rating": 4.9
        }

# ============================================
# CONTACT FORM ENDPOINT
# ============================================

@app.post("/api/contact")
@limiter.limit("5/minute")
async def submit_contact_form(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    """
    Submit a contact form message.
    Sends email notification to Artist Factory.
    """
    try:
        # Prepare contact data for email
        contact_data = {
            "name": name,
            "email": email,
            "message": message
        }
        
        # Send email notification
        email_sent = send_contact_message(contact_data)
        
        if email_sent:
            return {
                "success": True,
                "message": "Your message has been sent successfully. We'll get back to you soon!"
            }
        else:
            return {
                "success": False,
                "message": "Failed to send email. Please try again or contact us directly."
            }
            
    except Exception as e:
        print(f"Error submitting contact form: {e}")
        return {
            "success": False,
            "message": "An error occurred. Please try again later."
        }


# ============================================
# CLIENT LOGOS ENDPOINTS
# ============================================

@app.get("/api/client-logos")
@limiter.limit("100/minute")
def get_client_logos(request: Request):
    """Get all active client logos for the public website."""
    cache_key = "client_logos_all"
    if cache_key in cache:
        return cache[cache_key]
    try:
        response = (
            supabase.table("client_logos")
            .select("*")
            .eq("is_active", True)
            .order("display_order", desc=False)
            .execute()
        )
        result = response.data
        cache[cache_key] = result
        return result
    except Exception as e:
        print(f"Error fetching client logos: {e}")
        return []


@app.get("/admin/client-logos")
@limiter.limit("100/minute")
def get_all_client_logos(request: Request):
    """Get ALL client logos (including inactive) for admin panel."""
    try:
        response = (
            supabase.table("client_logos")
            .select("*")
            .order("display_order", desc=False)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Error fetching client logos: {e}")
        return []


@app.post("/admin/client-logos")
@limiter.limit("20/minute")
async def create_client_logo(
    request: Request,
    name: str = Form(...),
    display_order: int = Form(0),
    is_active: bool = Form(True),
    logo: UploadFile = File(None),
):
    """Create a new corporate client entry (with optional logo image)."""
    try:
        client_data = {
            "name": name,
            "display_order": display_order,
            "is_active": is_active,
            "logo_url": None,
        }

        response = supabase.table("client_logos").insert(client_data).execute()
        if not response.data:
            return {"success": False, "message": "Failed to create client"}

        client_id = response.data[0]["id"]

        if logo and logo.filename:
            ensure_bucket_exists("client-logos")
            file_bytes = await logo.read()
            ext = logo.filename.split(".")[-1] if "." in logo.filename else "png"
            sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", name.lower().replace(" ", "_"))
            path = f"{client_id}_{sanitized}.{ext}"
            supabase.storage.from_("client-logos").upload(
                path, file_bytes, file_options={"upsert": "true"}
            )
            logo_url = supabase.storage.from_("client-logos").get_public_url(path)
            supabase.table("client_logos").update({"logo_url": logo_url}).eq("id", client_id).execute()

        # Invalidate cache
        cache.pop("client_logos_all", None)
        return {"success": True, "message": "Client created", "id": client_id}
    except Exception as e:
        print(f"Error creating client logo: {e}")
        raise


@app.put("/admin/client-logos/{client_id}")
@limiter.limit("20/minute")
async def update_client_logo(
    request: Request,
    client_id: str,
    name: str = Form(None),
    display_order: int = Form(None),
    is_active: bool = Form(None),
    logo: UploadFile = File(None),
):
    """Update an existing corporate client entry."""
    try:
        update_data: dict = {}
        if name is not None:
            update_data["name"] = name
        if display_order is not None:
            update_data["display_order"] = display_order
        if is_active is not None:
            update_data["is_active"] = is_active

        if logo and logo.filename:
            ensure_bucket_exists("client-logos")
            file_bytes = await logo.read()
            ext = logo.filename.split(".")[-1] if "." in logo.filename else "png"
            label = name or client_id
            sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", str(label).lower().replace(" ", "_"))
            path = f"{client_id}_{sanitized}.{ext}"
            supabase.storage.from_("client-logos").upload(
                path, file_bytes, file_options={"upsert": "true"}
            )
            update_data["logo_url"] = supabase.storage.from_("client-logos").get_public_url(path)

        if update_data:
            supabase.table("client_logos").update(update_data).eq("id", client_id).execute()

        cache.pop("client_logos_all", None)
        return {"success": True, "message": "Client updated"}
    except Exception as e:
        print(f"Error updating client logo: {e}")
        raise


@app.delete("/admin/client-logos/{client_id}")
@limiter.limit("20/minute")
def delete_client_logo(request: Request, client_id: str):
    """Delete a corporate client entry."""
    try:
        supabase.table("client_logos").delete().eq("id", client_id).execute()
        cache.pop("client_logos_all", None)
        return {"success": True, "message": "Client deleted"}
    except Exception as e:
        print(f"Error deleting client logo: {e}")
        raise


# ============================================
# ARTIST TESTIMONIALS ENDPOINTS
# ============================================

@app.get("/api/artist-testimonials")
@limiter.limit("100/minute")
def get_artist_testimonials(request: Request):
    """Get all active artist testimonials for the public website."""
    cache_key = "artist_testimonials_all"
    if cache_key in cache:
        return cache[cache_key]
    try:
        response = (
            supabase.table("artist_testimonials")
            .select("*")
            .eq("is_active", True)
            .order("created_at", desc=False)
            .execute()
        )
        result = response.data
        cache[cache_key] = result
        return result
    except Exception as e:
        print(f"Error fetching artist testimonials: {e}")
        return []


@app.get("/admin/artist-testimonials")
@limiter.limit("100/minute")
def get_all_artist_testimonials(request: Request):
    """Get ALL artist testimonials (including inactive) for admin panel."""
    try:
        response = (
            supabase.table("artist_testimonials")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Error fetching artist testimonials: {e}")
        return []


@app.post("/admin/artist-testimonials")
@limiter.limit("20/minute")
async def create_artist_testimonial(
    request: Request,
    name: str = Form(...),
    role: str = Form(...),
    location: str = Form(...),
    review: str = Form(...),
    rating: int = Form(5),
    emoji: str = Form("🎵"),
    is_active: bool = Form(True),
    photo: UploadFile = File(None),
):
    """Create a new artist testimonial (with optional photo)."""
    try:
        data = {
            "name": name,
            "role": role,
            "location": location,
            "review": review,
            "rating": max(1, min(5, rating)),
            "emoji": emoji,
            "is_active": is_active,
            "photo_url": None,
        }

        response = supabase.table("artist_testimonials").insert(data).execute()
        if not response.data:
            return {"success": False, "message": "Failed to create testimonial"}

        testimonial_id = response.data[0]["id"]

        if photo and photo.filename:
            ensure_bucket_exists("artist-testimonials")
            file_bytes = await photo.read()
            ext = photo.filename.split(".")[-1] if "." in photo.filename else "jpg"
            sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", name.lower().replace(" ", "_"))
            path = f"{testimonial_id}_{sanitized}.{ext}"
            supabase.storage.from_("artist-testimonials").upload(
                path, file_bytes, file_options={"upsert": "true"}
            )
            photo_url = supabase.storage.from_("artist-testimonials").get_public_url(path)
            supabase.table("artist_testimonials").update({"photo_url": photo_url}).eq("id", testimonial_id).execute()

        cache.pop("artist_testimonials_all", None)
        return {"success": True, "message": "Testimonial created", "id": testimonial_id}
    except Exception as e:
        print(f"Error creating artist testimonial: {e}")
        raise


@app.put("/admin/artist-testimonials/{testimonial_id}")
@limiter.limit("20/minute")
async def update_artist_testimonial(
    request: Request,
    testimonial_id: str,
    name: str = Form(None),
    role: str = Form(None),
    location: str = Form(None),
    review: str = Form(None),
    rating: int = Form(None),
    emoji: str = Form(None),
    is_active: bool = Form(None),
    photo: UploadFile = File(None),
):
    """Update an existing artist testimonial."""
    try:
        update_data: dict = {}
        if name is not None:
            update_data["name"] = name
        if role is not None:
            update_data["role"] = role
        if location is not None:
            update_data["location"] = location
        if review is not None:
            update_data["review"] = review
        if rating is not None:
            update_data["rating"] = max(1, min(5, rating))
        if emoji is not None:
            update_data["emoji"] = emoji
        if is_active is not None:
            update_data["is_active"] = is_active

        if photo and photo.filename:
            ensure_bucket_exists("artist-testimonials")
            file_bytes = await photo.read()
            ext = photo.filename.split(".")[-1] if "." in photo.filename else "jpg"
            label = name or testimonial_id
            sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", str(label).lower().replace(" ", "_"))
            path = f"{testimonial_id}_{sanitized}.{ext}"
            supabase.storage.from_("artist-testimonials").upload(
                path, file_bytes, file_options={"upsert": "true"}
            )
            update_data["photo_url"] = supabase.storage.from_("artist-testimonials").get_public_url(path)

        if update_data:
            supabase.table("artist_testimonials").update(update_data).eq("id", testimonial_id).execute()

        cache.pop("artist_testimonials_all", None)
        return {"success": True, "message": "Testimonial updated"}
    except Exception as e:
        print(f"Error updating artist testimonial: {e}")
        raise


@app.delete("/admin/artist-testimonials/{testimonial_id}")
@limiter.limit("20/minute")
def delete_artist_testimonial(request: Request, testimonial_id: str):
    """Delete an artist testimonial."""
    try:
        supabase.table("artist_testimonials").delete().eq("id", testimonial_id).execute()
        cache.pop("artist_testimonials_all", None)
        return {"success": True, "message": "Testimonial deleted"}
    except Exception as e:
        print(f"Error deleting artist testimonial: {e}")
        raise

# ─────────────────────────────────────────────
#  PORTFOLIO ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/api/portfolio")
@limiter.limit("60/minute")
def get_portfolio(request: Request):
    """Return portfolio images and videos."""
    try:
        cached = cache.get("portfolio")
        if cached:
            return cached
        result = supabase.table("portfolio").select("*").order("created_at", desc=True).execute()
        images = [r for r in result.data if r.get("type") == "image"]
        videos = [r for r in result.data if r.get("type") == "video"]
        payload = {
            "images": [{"id": r["id"], "url": r["url"], "title": r.get("title", ""), "created_at": r.get("created_at", "")} for r in images],
            "videos": [{"id": r["id"], "url": r["url"], "title": r.get("title", ""), "created_at": r.get("created_at", "")} for r in videos],
        }
        cache["portfolio"] = payload
        return payload
    except Exception as e:
        print(f"Error fetching portfolio: {e}")
        return {"images": [], "videos": []}


@app.post("/admin/portfolio/images")
@limiter.limit("20/minute")
async def upload_portfolio_image(request: Request, file: UploadFile = File(...), title: str = Form("")):
    import time as _time
    try:
        ensure_bucket_exists("portfolio")
        file_bytes = await file.read()
        ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
        sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", title.lower().replace(" ", "_")) if title else "image"
        filename = sanitized + "_" + str(int(_time.time())) + "." + ext
        supabase.storage.from_("portfolio").upload(filename, file_bytes, file_options={"upsert": "true"})
        url = supabase.storage.from_("portfolio").get_public_url(filename)
        supabase.table("portfolio").insert({"type": "image", "url": url, "title": title}).execute()
        cache.pop("portfolio", None)
        return {"success": True, "url": url, "title": title}
    except Exception as e:
        print(f"Error uploading portfolio image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/portfolio/videos")
@limiter.limit("20/minute")
async def add_portfolio_video(request: Request, url: str = Form(...), title: str = Form("")):
    try:
        supabase.table("portfolio").insert({"type": "video", "url": url, "title": title}).execute()
        cache.pop("portfolio", None)
        return {"success": True, "url": url, "title": title}
    except Exception as e:
        print(f"Error adding portfolio video: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/admin/portfolio/{item_id}")
@limiter.limit("20/minute")
def delete_portfolio_item(request: Request, item_id: str):
    """Delete a portfolio item (also removes image from storage)."""
    try:
        result = supabase.table("portfolio").select("*").eq("id", item_id).execute()
        if result.data:
            item = result.data[0]
            if item.get("type") == "image":
                try:
                    url_str = item.get("url", "")
                    fname = url_str.split("/")[-1].split("?")[0]
                    supabase.storage.from_("portfolio").remove([fname])
                except Exception:
                    pass
        supabase.table("portfolio").delete().eq("id", item_id).execute()
        cache.pop("portfolio", None)
        return {"success": True, "message": "Portfolio item deleted"}
    except Exception as e:
        print(f"Error deleting portfolio item: {e}")
        raise HTTPException(status_code=500, detail=str(e))
