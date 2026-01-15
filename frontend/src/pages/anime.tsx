import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

interface Anime {
    Titulo: string;
    Img: string;
    Sipnosis: string;
}


function anime() {
    const { id } = useParams();
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [cap, setCap] = useState<string[]>([]);
    const [screenshots, setScreenshots] = useState<string[]>([]);
    const [imagenes, setImagenes] = useState([]);
    const [madurez, setMadurez] = useState('');
    const [score, setScore] = useState('');
    const [calidad, setCalidad] = useState('');
    const [estado, setEstado] = useState('');
    const [fecha, setFecha] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAnimes = async () => {
        fetch(`/api/SeleccionAnime`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_anime: id }),
        })
            .then((response) => response.json())
            .then((data) => {
                setAnimes(data.Informacion);
                const info_capitulos = data.Informacion[0].Cap[0];
                setCap(info_capitulos.Num);
                setScreenshots(info_capitulos.Screen);
                setCalidad(data.Calidad);
                setEstado(data.Estado);
                setFecha(data.Fecha);
                setLoading(false);
            })
    };

    const fetchDatosAnime = async () => {
        fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(id || '')}&limit=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setMadurez(data.data[0].rating);
                setScore(data.data[0].score);
            })
    };

    const fetchWallpaper = async () => {
        fetch(`https://api-anime-steel.vercel.app/meta/anilist/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const cover = data.results[0].cover
                if (cover == null) {
                    setImagenes(data.results[0].image)
                } else {
                    setImagenes(data.results[0].cover)
                }
            })
    };

    const bgWallpaper = () => ({
        '--bg-image': imagenes ? `url(${imagenes})` : 'none',
    } as React.CSSProperties);

    const clasificacionEdad = () => {
        if (!madurez) return 'N/A';
        if (madurez.includes('G')) return 'General';
        if (madurez.includes('PG')) return 'Niños';
        if (madurez.includes('PG-13')) return '13+';
        if (madurez.includes('R - 17+')) return '17+';
        if (madurez.includes('R+')) return '18+ (Desnudez)';
        if (madurez.includes('Rx')) return 'Adulto';
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchAnimes();
        fetchDatosAnime();
        fetchWallpaper();
    }, []);
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <section className="hero-anime" style={bgWallpaper()}>
                        {animes.length > 0 && (
                            <div key={animes[0].Titulo} className="anime-item">
                                <img src={animes[0].Img} alt={animes[0].Titulo}></img>
                                <h2>{animes[0].Titulo}</h2>
                                <div className="anime-item-info">
                                    <p className="rating">Madurez: {clasificacionEdad()}</p>
                                    <p className="score">Score: {score}</p>
                                    <p className="estado">Estado: <span className={estado ? "emitiendo" : "finish"}>{estado ? "En Emisión" : 'Finalizado'}</span></p>
                                </div>
                                <p>{animes[0].Sipnosis}</p>
                            </div>
                        )}
                    </section>

                    <section className="episodes">
                        <div className="episodes-title">
                            <h2>Episodios</h2>
                            <hr></hr>
                        </div>
                        <ul className="episodes-list">
                            {cap.map((ep, index) => (
                                <li key={ep} onClick={() => navigate(`/ver/${id}-${ep}`)}><img src={screenshots[index]} alt={ep}></img><a>Episodio {ep}</a></li>
                            ))}
                            {estado ? (
                                <li onClick={() => navigate(`#`)}><img src={animes[0].Img} alt={animes[0].Titulo}></img><a>Proximo Capitulo: {fecha.split('T')[0]}</a></li>
                            ) : null}
                        </ul>
                    </section>

                </>
            )
            }
        </div>
    );
}

export default anime;