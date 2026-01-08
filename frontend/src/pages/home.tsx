import '../style.css'
import { useEffect, useState } from 'react';

interface AnimeRandom {
    Titulo: string;
    Img: string;
    Sipnosis: string;
}

interface AnimeRecientes {
    Titulo: string;
    Img: string;
}

function Home() {

    const [animeRandom, setAnimeRandom] = useState<AnimeRandom[]>([]);
    const [recientes, setRecientes] = useState<AnimeRecientes[]>([]);
    const [loading, setLoading] = useState(true);

    const Hero = async () => {
        const respuesta = await fetch('/api/AnimeRandom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setAnimeRandom(data.Informacion);
                setLoading(false);
            })
    }

    const ListRecientes = async () => {
        const respuesta = await fetch('/api/AnimesRecientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {

                const recientes = data.Informacion[0].Titulo.map((anime: string, index: number) => ({
                    id: index,
                    Titulo: anime,
                    Img: data.Informacion[0].Img[index],
                }));

                setRecientes(recientes);
                setLoading(false);
            })
    }

    useEffect(() => {
        Hero();
        ListRecientes();
    }, []);



    return (
        <div>
            <main>
                <section className="hero">
                    <div className="hero-content">
                        {animeRandom.length > 0 && (
                            <>
                                <img className="hero-img" src={animeRandom[0].Img} alt={animeRandom[0].Titulo}></img>
                                <div className="hero-text">
                                    <h2 className="anime-title">{animeRandom[0].Titulo}</h2>
                                    <p className="anime-subtitle">{animeRandom[0].Sipnosis}</p>
                                    <button className="hero-button">Ver</button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
                <section className="listAnimes">
                    <div className="recientes">
                        <h2 className="recientes-title">Animes Recientes</h2>
                        <hr></hr>
                    </div>
                    <div className="recientes-list">
                        <ul className="Anime-List">
                            {recientes.length > 0 && (
                                recientes.map((anime) => (
                                    console.log(anime),
                                    <li className='recientes-item' key={anime.Titulo}>
                                        <img src={anime.Img} alt={anime.Titulo}></img>
                                        <p>{anime.Titulo}</p>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
