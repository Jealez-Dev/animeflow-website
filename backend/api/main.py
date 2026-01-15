from . import appAnime2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union, List
from fastapi.staticfiles import StaticFiles
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import os

app = FastAPI()

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

class Anime(BaseModel):
    nombre_anime: Optional[str] = None
    selectEP: Optional[str] = None
    year: Optional[Union[List[str], str]] = None
    genre: Optional[Union[List[str], str]] = None
    type_anime: Optional[Union[List[str], str]] = None
    status: Optional[Union[List[str], str]] = None
    order: Optional[str] = None
    page: Optional[str] = None

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

@app.post("/api/Directorio")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    print(anime)
    results = animeAPP.Buscar_anime(anime.nombre_anime,anime.year, anime.genre, anime.type_anime, anime.status, anime.order, anime.page)
    return {"listado": results, "Page": results["Page"]}

@app.post("/api/SeleccionAnime")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    response = supabase.table("animes").select("*").eq("slug", anime.nombre_anime).maybe_single().execute()
    actualizar = False
    caps_guardados = 0

    if response is None or response.data is None:
        actualizar = True
    else:
        if response.data["estado"] == True:
            fechaActual = datetime.now(timezone.utc)
            fecha_next_cap = datetime.fromisoformat(response.data["date_next_cap"].replace("Z", "+00:00"))
            esHoy = fechaActual >= fecha_next_cap
            print("Fecha actual: ", fechaActual)
            print("Fecha next cap: ", fecha_next_cap)
            print("Es hoy: ", esHoy)

            if esHoy:
                actualizar = True
                print("Si es hoy")
        
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
                fecha_next_cap = (datetime.now(timezone.utc) + timedelta(hours=2)).replace(tzinfo=timezone.utc)
            
        supabase.table("animes").upsert({
                "slug": anime.nombre_anime,
                "info": anime_info,
                "estado": anime_info[0]["Estado"],
                "date_next_cap": fecha_next_cap.isoformat() if fecha_next_cap else None,
                "Capitulos": caps_actuales
            }).execute()
        return {"Informacion": anime_info, "Estado": anime_info[0]["Estado"], "Fecha": fecha_next_cap.isoformat() if fecha_next_cap else None}
    else:
        anime_info = response.data["info"]
        return {"Informacion": anime_info, "Estado": anime_info[0]["Estado"], "Fecha": response.data["date_next_cap"]}


@app.post("/api/SeleccionCap")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    response = supabase.table("episodios").select("*").eq("id_episodio", anime.selectEP).maybe_single().execute()
    if response is None or response.data is None:
        links = animeAPP.select_cap(anime.selectEP)
        supabase.table("episodios").upsert({
            "id_episodio": anime.selectEP,
            "anime_slug": anime.nombre_anime,
            "links": links,
            "created_at": datetime.now(timezone.utc).isoformat()
        }).execute()
        return {"Url": links}
    else:
        links = response.data["links"]
        cantCap = supabase.table("animes").select("Capitulos").eq("slug", anime.nombre_anime).maybe_single().execute()
        return {"Url": links, "CantCap": cantCap.data["Capitulos"]}

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
