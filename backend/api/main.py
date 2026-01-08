from . import appAnime2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

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
    return {"Informacion": animeAPP.select_anime(anime.nombre_anime)}

@app.post("/api/SeleccionCap")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    return {"Url": animeAPP.select_cap(anime.nombre_anime)}

@app.post("/api/AnimeRandom")
async def anime():
    animeAPP = appAnime2.Anime()
    return {"Informacion": animeAPP.anime_random()}

@app.post("/api/AnimesRecientes")
async def anime():
    animeAPP = appAnime2.Anime()
    return {"Informacion": animeAPP.animes_Recientes()}

@app.post("/api/Wallpaper")
async def anime(anime: Anime):
    animeAPP = appAnime2.Anime()
    return {"Wallpaper": animeAPP.wallpaper(anime.nombre_anime)}

if os.path.exists("public"):
    app.mount("/", StaticFiles(directory="public", html=True), name="public")
