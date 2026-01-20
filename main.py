from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from db import conn
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

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO singers (name, genre, experience_years, base_price, location, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, genre, experience_years, base_price, location, image_url))
    conn.commit()

    return {"message": "Singer created"}



@app.get("/singers")
def get_singers():
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, name, genre, experience_years, base_price, location, created_at, image_url FROM singers")
        rows = cur.fetchall()
        singers = []
        for row in rows:
            singers.append({
                "id": row[0],
                "name": row[1],
                "genre": row[2],
                "experience_years": row[3],
                "base_price": row[4],
                "location": row[5],
                "created_at": str(row[6]) if row[6] else None,
                "image_url": row[7]
            })
        return singers
    except Exception as e:
        conn.rollback()
        raise


@app.put("/admin/singers/{id}")
def update_singer(id: int, name: str):
    cur = conn.cursor()
    cur.execute("UPDATE singers SET name=%s WHERE id=%s", (name, id))
    conn.commit()
    return {"message": "Singer updated"}


@app.delete("/admin/singers/{id}")
def delete_singer(id: int):
    cur = conn.cursor()
    cur.execute("DELETE FROM singers WHERE id=%s", (id,))
    conn.commit()
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

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO events (event_name, event_date, location, singer_id, image_url)
        VALUES (%s, %s, %s, %s, %s)
    """, (event_name, event_date, location, singer_id, image_url))
    conn.commit()

    return {"message": "Event created"}


@app.get("/events")
def get_events():
    cur = conn.cursor()
    cur.execute("""
        SELECT e.id, e.event_name, e.event_date, e.location, e.image_url, s.name, e.singer_id
        FROM events e
        left join singers s on e.singer_id = s.id
    """)
    rows = cur.fetchall()
    events = []
    for row in rows:
        events.append({
            "id": row[0],
            "event_name": row[1],
            "event_date": row[2],
            "location": row[3],
            "image_url": row[4],
            "singer_name": row[5],
            "singer_id": row[6]
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
    cur = conn.cursor()
    cur.execute("""
        UPDATE events
        SET event_name=%s,
            event_date=%s,
            location=%s,
            singer_id=%s
        WHERE id=%s
    """, (event_name, event_date, location, singer_id, event_id))
    conn.commit()
    return {"message": "Event updated"}
@app.delete("/admin/events/{event_id}")
def delete_event(event_id: int):
    cur = conn.cursor()
    cur.execute("DELETE FROM events WHERE id=%s", (event_id,))
    conn.commit()
    return {"message": "Event deleted"}