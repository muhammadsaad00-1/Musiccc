"""
Spotify API Integration for fetching artist discography and top songs.
Uses the Spotify Web API with Client Credentials flow.

To use this module:
1. Create a Spotify Developer account at https://developer.spotify.com/
2. Create an app to get your Client ID and Client Secret
3. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables
   or update the values below
"""

import os
import base64
import httpx
from typing import Optional
from functools import lru_cache
import time

# Spotify API credentials - set these in your environment or update directly
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "")

# Cache for access token
_token_cache = {
    "access_token": None,
    "expires_at": 0
}


async def get_spotify_token() -> Optional[str]:
    """Get Spotify access token using Client Credentials flow."""
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        print("Spotify credentials not configured")
        return None
    
    # Check if cached token is still valid
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["access_token"]
    
    # Request new token
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://accounts.spotify.com/api/token",
                headers={
                    "Authorization": f"Basic {auth_base64}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data={"grant_type": "client_credentials"}
            )
            
            if response.status_code == 200:
                data = response.json()
                _token_cache["access_token"] = data["access_token"]
                _token_cache["expires_at"] = time.time() + data["expires_in"] - 60  # 60s buffer
                return data["access_token"]
            else:
                print(f"Failed to get Spotify token: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error getting Spotify token: {e}")
            return None


async def search_artist(artist_name: str) -> Optional[dict]:
    """Search for an artist on Spotify by name."""
    token = await get_spotify_token()
    if not token:
        return None
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://api.spotify.com/v1/search",
                headers={"Authorization": f"Bearer {token}"},
                params={
                    "q": artist_name,
                    "type": "artist",
                    "limit": 1
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                artists = data.get("artists", {}).get("items", [])
                if artists:
                    return artists[0]
            return None
        except Exception as e:
            print(f"Error searching artist: {e}")
            return None


async def get_artist_top_tracks(artist_id: str, market: str = "US") -> list:
    """Get an artist's top tracks on Spotify."""
    token = await get_spotify_token()
    if not token:
        return []
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks",
                headers={"Authorization": f"Bearer {token}"},
                params={"market": market}
            )
            
            if response.status_code == 200:
                data = response.json()
                tracks = data.get("tracks", [])
                
                # Format tracks for frontend
                formatted_tracks = []
                for i, track in enumerate(tracks[:10]):  # Top 10 tracks
                    duration_ms = track.get("duration_ms", 0)
                    minutes = duration_ms // 60000
                    seconds = (duration_ms % 60000) // 1000
                    
                    formatted_tracks.append({
                        "id": i + 1,
                        "name": track.get("name"),
                        "plays": format_plays(track.get("popularity", 0)),
                        "duration": f"{minutes}:{seconds:02d}",
                        "album": track.get("album", {}).get("name"),
                        "preview_url": track.get("preview_url"),
                        "spotify_url": track.get("external_urls", {}).get("spotify"),
                        "image": track.get("album", {}).get("images", [{}])[0].get("url")
                    })
                
                return formatted_tracks
            return []
        except Exception as e:
            print(f"Error getting top tracks: {e}")
            return []


async def get_artist_albums(artist_id: str, limit: int = 10) -> list:
    """Get an artist's albums on Spotify."""
    token = await get_spotify_token()
    if not token:
        return []
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.spotify.com/v1/artists/{artist_id}/albums",
                headers={"Authorization": f"Bearer {token}"},
                params={
                    "include_groups": "album,single",
                    "limit": limit,
                    "market": "US"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                albums = data.get("items", [])
                
                # Format albums for frontend
                formatted_albums = []
                for i, album in enumerate(albums):
                    formatted_albums.append({
                        "id": i + 1,
                        "name": album.get("name"),
                        "year": album.get("release_date", "")[:4],
                        "cover": album.get("images", [{}])[0].get("url"),
                        "tracks": album.get("total_tracks", 0),
                        "spotify_url": album.get("external_urls", {}).get("spotify"),
                        "type": album.get("album_type")
                    })
                
                return formatted_albums
            return []
        except Exception as e:
            print(f"Error getting albums: {e}")
            return []


async def get_artist_discography(artist_name: str) -> dict:
    """
    Get complete artist discography including top tracks and albums.
    Returns data formatted for the frontend.
    """
    # Search for the artist
    artist = await search_artist(artist_name)
    
    if not artist:
        return {
            "found": False,
            "message": "Artist not found on Spotify",
            "topTracks": [],
            "albums": []
        }
    
    artist_id = artist["id"]
    
    # Fetch top tracks and albums in parallel
    top_tracks = await get_artist_top_tracks(artist_id)
    albums = await get_artist_albums(artist_id)
    
    return {
        "found": True,
        "spotify_id": artist_id,
        "spotify_url": artist.get("external_urls", {}).get("spotify"),
        "spotify_image": artist.get("images", [{}])[0].get("url") if artist.get("images") else None,
        "followers": artist.get("followers", {}).get("total", 0),
        "popularity": artist.get("popularity", 0),
        "genres": artist.get("genres", []),
        "topTracks": top_tracks,
        "albums": albums
    }


def format_plays(popularity: int) -> str:
    """Convert Spotify popularity (0-100) to approximate play count string."""
    # Spotify doesn't give exact play counts, so we estimate based on popularity
    if popularity >= 90:
        return "100M+"
    elif popularity >= 80:
        return "50M+"
    elif popularity >= 70:
        return "20M+"
    elif popularity >= 60:
        return "10M+"
    elif popularity >= 50:
        return "5M+"
    elif popularity >= 40:
        return "1M+"
    elif popularity >= 30:
        return "500K+"
    elif popularity >= 20:
        return "100K+"
    elif popularity >= 10:
        return "50K+"
    else:
        return "10K+"
