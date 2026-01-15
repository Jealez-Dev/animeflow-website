import { useState, useEffect, useEffectEvent, useMemo } from "react";
import Loading from "../components/Loading";
import Filters from "../components/selectFilters";


interface Anime {
    Titulo: string;
    Img: string;
    Link: string;
}

function Directorio() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [filters, setFilters] = useState({
        year: [],
        genre: [],
        status_anime: [],
        type_anime: [],
        order: '',
        page: '1',
    });
    const [totalPages, setTotalPages] = useState();
    const [loading, setLoading] = useState(true);
    const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990"]
    const genres = [
        "Acción", "Artes Marciales", "Aventuras", "Carreras", "Ciencia Ficción",
        "Comedia", "Demencia", "Demonios", "Deportes", "Drama",
        "Ecchi", "Escolares", "Espacial", "Fantasía", "Harem",
        "Histórico", "Infantil", "Josei", "Juegos", "Magia",
        "Mecha", "Militar", "Misterio", "Música", "Parodia",
        "Policía", "Psicológico", "Recuentos de la vida", "Romance", "Samurai",
        "Seinen", "Shoujo", "Shounen", "Sobrenatural", "Superpoderes",
        "Suspenso", "Terror", "Vampiros", "Yaoi", "Yuri"
    ];
    const status_anime = ["En emisión", "Finalizado", "Proximamente"];
    const type_anime = ["TV", "OVA", "Movie", "Special"];

    const fetchAnimes = async () => {
        fetch(`/api/Directorio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ year: filters.year, genre: filters.genre, type_anime: filters.type_anime, status: filters.status_anime, order: filters.order, page: filters.page }),
        })
            .then((response) => response.json())
            .then((data) => {
                const list = data.listado.Titulo.map((anime: string, index: number) => ({
                    id: index,
                    Titulo: anime,
                    Img: data.listado.Img[index],
                    Link: data.listado.Link[index],
                }))
                setAnimes(list);
                setTotalPages(data.Page);
                console.log(data.Page);
                setLoading(false);
            })
    };
    const Pagination = ({ actualPage, totalPages, onChange }: { actualPage: number, totalPages: number, onChange: (page: number) => void }) => {
        const paginas = useMemo(() => {
            const delta = 4;
            const pages = [];
            // Si no hay páginas o solo hay 1, no dibujamos nada
            if (totalPages <= 1) return [];

            pages.push(1);
            let inicio = Math.max(2, actualPage - delta);
            let fin = Math.min(totalPages - 1, actualPage + delta);

            if (inicio > 2) pages.push("...");

            for (let i = inicio; i <= fin; i++) {
                pages.push(i);
            }

            if (fin < totalPages - 1) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);
            return pages;
        }, [actualPage, totalPages]);
        return (
            <div className="browse-pagination">
                <button onClick={() => onChange(actualPage - 1)} disabled={actualPage === 1}>←</button>
                {paginas.map((page) => (
                    page === "..." ? <span key={page}>{page}</span> : <button key={page} onClick={() => onChange(page as number)} className={page === actualPage ? 'active' : ''}>{page}</button>
                ))}
                <button onClick={() => onChange(actualPage + 1)} disabled={actualPage === totalPages}>→</button>
            </div>
        );
    }

    useEffect(() => {
        fetchAnimes();
        setLoading(true);
    }, [filters.year, filters.genre, filters.status_anime, filters.type_anime, filters.order, filters.page]);

    return (
        <div className="browse">
            <h1 className="browse-title">Listado de animes</h1>
            <div className="browse-filters">
                <Filters
                    label="Año"
                    options={years}
                    value="year"
                    setFilters={setFilters}
                    filters={filters}
                />
                <Filters
                    label="Genero"
                    options={genres}
                    value="genre"
                    setFilters={setFilters}
                    filters={filters}
                />
                <Filters
                    label="Estado"
                    options={status_anime}
                    value="status_anime"
                    setFilters={setFilters}
                    filters={filters}
                />
                <Filters
                    label="Tipo"
                    options={type_anime}
                    value="type_anime"
                    setFilters={setFilters}
                    filters={filters}
                />
                <p className="browse-page">Pagina {filters.page}</p>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <ul className="Anime-List">
                    {animes.map((anime) => (
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
            <Pagination actualPage={Number(filters.page)} totalPages={totalPages || 1} onChange={(page) => setFilters({ ...filters, page: page.toString() })} />
        </div >
    );
}

export default Directorio;