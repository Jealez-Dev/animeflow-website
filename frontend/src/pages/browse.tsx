import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

interface Anime {
    Titulo: string;
    Img: string;
    Link: string;
}

function Browse() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    console.log(q);

    useEffect(() => {
        const fetchAnimes = async () => {
            fetch(`/api/BuscarAnime`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre_anime: q }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const list = data.listado.Titulo.map((anime: string, index: number) => ({
                        id: index,
                        Titulo: anime,
                        Img: data.listado.Img[index],
                        Link: data.listado.Link[index],
                    }))
                    console.log(list);
                    setAnimes(list);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        };
        fetchAnimes();
    }, [q]);

    return (
        <div className="browse">
            <h1 className="browse-title">Resultados de la busqueda: <span style={{ color: 'var(--secondary-color)' }}>{q}</span></h1>
            {loading ? (
                <Loading />
            ) : (
                <ul className="Anime-List">
                    {animes.map((anime) => (
                        console.log(anime),
                        <li key={anime.Titulo} className="recientes-item">
                            <a href={`/anime/${anime.Link}`}>
                                <img src={anime.Img} alt={anime.Titulo}></img>
                                <p>{anime.Titulo}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    );
}

export default Browse;