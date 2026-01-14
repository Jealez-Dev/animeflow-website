from . import appAnime2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi.staticfiles import StaticFiles
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone
import os

app = FastAPI()

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

class Anime(BaseModel):
    nombre_anime: str
    selectEP: Optional[str] = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/BuscarAnime")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    return {"listado": animeAPP.listado_anime(anime.nombre_anime)}

@app.post("/api/SeleccionAnime")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    response = supabase.table("animes").select("*").eq("slug", anime.nombre_anime).maybe_single().execute()
    actualizar = False
    caps_guardados = 0

    if response is None or response.data is None:
        actualizar = True
    else:
        if response.data["estado"] == "En emision":
            fechaActual = datetime.now(timezone.utc)
            fecha_next_cap = datetime.fromisoformat(response.data["date_next_cap"].replace("Z", "+00:00"))
            esHoy = fechaActual >= fecha_next_cap

            if esHoy:
                actualizar = True
        
        caps_guardados = response.data["Capitulos"]

    if actualizar:
        anime_info = animeAPP.select_anime(anime.nombre_anime)
        fecha_next_cap = None
        caps_actuales = len(anime_info[0].get("Cap", [{}])[0].get("Num", []))

        if anime_info[0]["Estado"] == True:
            fecha_next_cap = datetime.fromisoformat(anime_info[0]["Date"]).replace(tzinfo=timezone.utc)

            print(caps_actuales)
            print(caps_guardados)

            if caps_actuales > caps_guardados:
                fecha_next_cap = datetime.fromisoformat(anime_info[0]["Date"]).replace(tzinfo=timezone.utc)
            else:
                fecha_next_cap = (datetime.now(timezone.utc) + timedelta(hours=8)).replace(tzinfo=timezone.utc)
            
        supabase.table("animes").upsert({
                "slug": anime.nombre_anime,
                "info": anime_info,
                "calidad": anime_info[0]["Calidad"],
                "estado": anime_info[0]["Estado"],
                "date_next_cap": fecha_next_cap.isoformat() if fecha_next_cap else None,
                "Capitulos": caps_actuales
            }).execute()
        return {"Informacion": anime_info, "Estado": anime_info[0]["Estado"], "Calidad": anime_info[0]["Calidad"]}
    else:
        anime_info = response.data["info"]
        calidad = response.data["calidad"]
        return {"Informacion": anime_info, "Estado": anime_info[0]["Estado"], "Calidad": calidad}


@app.post("/api/SeleccionCap")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    response = supabase.table("episodios").select("*").eq("id_episodio", anime.selectEP).maybe_single().execute()
    if response is None or response.data is None:
        links = animeAPP.select_cap(anime.nombre_anime)
        supabase.table("episodios").upsert({
            "id_episodio": anime.selectEP,
            "anime_slug": anime.nombre_anime,
            "links": links,
            "created_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    else:
        links = response.data["links"]
        return {"Url": links}

@app.get("/api/AnimeRandom")
async def anime():
    animeAPP = appAnime2.Anime()
    return {"Informacion": animeAPP.anime_random()}

@app.get("/api/AnimesRecientes")
async def anime():
    animeAPP = appAnime2.Anime()

    response = supabase.table("home_cache").select("*").eq("id", 1).maybe_single().execute()

    fechaActual = datetime.now(timezone.utc)
    actualizar = False
    
    if response is None or response.data is None:
        actualizar = True
    else:
        fechaCache = datetime.fromisoformat(response.data["updated_at"].replace('Z', "+00:00"))
        diferencia = fechaActual - fechaCache
        if diferencia.days >= 1:
            actualizar = True

    if actualizar:
        animes = animeAPP.animes_Recientes()
        supabase.table("home_cache").upsert({
            "id": 1,
            "updated_at": fechaActual.isoformat(),
            "data": animes
        }).execute()
        return {"Informacion": animes}
    else:
        return {"Informacion": response.data["data"]}

if os.path.exists("public"):
    app.mount("/", StaticFiles(directory="public", html=True), name="public")
