from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase

app = FastAPI()

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
def read_root():
    return FileResponse("frontend/user/index.html")

@app.get("/admin")
def read_admin():
    return FileResponse("frontend/admin/admin.html")


@app.post("/admin/singers")
def create_singer(
    name: str,
    genre: str,
    experience_years: int,
    base_price: int,
    location: str,
    image: UploadFile = File(...)
):
    file_bytes = image.file.read()

    # Fixed: removed duplicate 'singers/' prefix
    path = f"{image.filename}"
    supabase.storage.from_("singers").upload(path, file_bytes)

    image_url = supabase.storage.from_("singers").get_public_url(path)

    supabase.table("singers").insert({
        "name": name,
        "genre": genre,
        "experience_years": experience_years,
        "base_price": base_price,
        "location": location,
        "image_url": image_url
    }).execute()

    return {"message": "Singer created"}



@app.get("/singers")
def get_singers():
    try:
        response = supabase.table("singers").select("*").execute()
        return response.data
    except Exception as e:
        raise


@app.put("/admin/singers/{id}")
def update_singer(id: int, name: str):
    supabase.table("singers").update({"name": name}).eq("id", id).execute()
    return {"message": "Singer updated"}


@app.delete("/admin/singers/{id}")
def delete_singer(id: int):
    supabase.table("singers").delete().eq("id", id).execute()
    return {"message": "Singer deleted"}



@app.post("/admin/events")
def create_event(
    event_name: str,
    event_date: str,
    location: str,
    singer_id: int,
    image: UploadFile = File(...)
):
    file_bytes = image.file.read()
    # Fixed: removed duplicate 'events/' prefix
    path = f"{image.filename}"

    supabase.storage.from_("events").upload(path, file_bytes)
    image_url = supabase.storage.from_("events").get_public_url(path)

    supabase.table("events").insert({
        "event_name": event_name,
        "event_date": event_date,
        "location": location,
        "singer_id": singer_id,
        "image_url": image_url
    }).execute()

    return {"message": "Event created"}


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*, singers(name)").execute()
    events = []
    for event in response.data:
        events.append({
            "id": event["id"],
            "event_name": event["event_name"],
            "event_date": event["event_date"],
            "location": event["location"],
            "image_url": event["image_url"],
            "singer_name": event["singers"]["name"] if event.get("singers") else None,
            "singer_id": event["singer_id"]
        })
    return events



@app.put("/admin/events/{event_id}")
def update_event(
    event_id: int,
    event_name: str,
    event_date: str,
    location: str,
    singer_id: int
):
    supabase.table("events").update({
        "event_name": event_name,
        "event_date": event_date,
        "location": location,
        "singer_id": singer_id
    }).eq("id", event_id).execute()
    return {"message": "Event updated"}
@app.delete("/admin/events/{event_id}")
def delete_event(event_id: int):
    supabase.table("events").delete().eq("id", event_id).execute()
    return {"message": "Event deleted"}