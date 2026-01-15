import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading2";
import FullScreenSvg from "../components/fullscreensvg";

function ver() {

    const { id, episodio } = useParams();
    const [urls, setUrls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [overlay, setOverlay] = useState(false)
    const [server, setServer] = useState('')
    const [Capitulos, setCapitulos] = useState()
    const [status, setStatusFullscreen] = useState(false)
    const [color, setColor] = useState('#8b8b8b')
    const [hideBtnsAll, setHideBtnsAll] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [styleBtns, setStyleBtns] = useState({ opacity: 1 })
    const navigate = useNavigate();

    /* Modal mediaQuery */
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const [isMobile, setIsMobile] = useState(mediaQuery.matches)

    const fetchCap = () => {
        fetch('/api/SeleccionCap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_anime: id?.slice(0, id.lastIndexOf('-')) || '', selectEP: id }),
        })
            .then(response => response.json())
            .then((data) => {
                setUrls(data.Url)
                setLoading(false);
            });
    };

    const fetchCapitulos = async (anime: string) => {
        fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime || '')}&limit=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCapitulos(data.data[0].episodes)
                setTitulo(data.data[0].title)
                setLoading(false);
            })
    };

    const verServers = () => {
        const droplist = document.querySelector('.list-servers')
        if (overlay) {
            setOverlay(false)
            droplist?.classList.remove('visible')
        }
        else {
            setOverlay(true)
            droplist?.classList.add('visible')
        }

    }

    const NextCap = () => {

        const slugOriginal = id || ''

        const NumBase = parseInt(slugOriginal.match(/\d+$/)?.[0] || "0");
        const next_num = NumBase + 1;

        let next_cap = id?.replace(/\d+$/, next_num.toString())

        const cantCap = Capitulos || 0

        if (next_num <= cantCap) {
            navigate(`/ver/${next_cap}`)
        }
    }

    const BackCap = () => {

        const slugOriginal = id || ''

        const NumBase = parseInt(slugOriginal.match(/\d+$/)?.[0] || "0");
        const next_num = NumBase - 1;

        let next_cap = id?.replace(/\d+$/, next_num.toString())

        if (next_num > 0) {
            navigate(`/ver/${next_cap}`)
        }
    }

    const disableNavBtns = () => {
        let disablebtnNew = document.querySelector('.btn-nextCap')
        let disablebtnBack = document.querySelector('.btn-backCap')

        const slugOriginal = id || ''

        const NumBase = parseInt(slugOriginal.match(/\d+$/)?.[0] || "0");
        const cantCap = Capitulos || 0

        if (NumBase == cantCap) {
            disablebtnNew?.classList.add('nothing')
        } else {
            disablebtnNew?.classList.remove('nothing')
        }

        if (NumBase == 1) {
            disablebtnBack?.classList.add('nothing')
        } else {
            disablebtnBack?.classList.remove('nothing')
        }

    }

    const FullScreen = () => {
        const iframe = document.querySelector('.btn-fullscreen')
        const video = document.querySelector('.player-container') as any
        setStatusFullscreen(!status)

        if (status) {
            document.exitFullscreen()
        } else {
            video?.requestFullscreen()
        }
    }

    const changeServer = urls.find(
        item => item.nombre === server
    )

    const extraerServidoresHD = async () => {
        const url = id?.slice(0, id.lastIndexOf('-'))
        const cap = id?.match(/\d+$/)?.[0]
        const urlObjetivo = `https://jkanime.net/${url}/${cap}`
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(urlObjetivo)}`)
        console.log("Status del Proxy:", response.status);
        const data = await response.json()
        console.log("Contenido crudo del Proxy:", data.contents);
        const regex = /video\[\d+\]\s*=\s*'<iframe.*?src="([^"]+)"/g;

        let servidoresHD = []
        let match;

        while (match = regex.exec(data)) {
            servidoresHD.push(match[1])
        }

        console.log("servidoresHD -->", servidoresHD)
    }



    disableNavBtns()

    useEffect(() => {
        fetchCap();
        fetchCapitulos(id ? id?.slice(0, id.lastIndexOf('-')) : '');
        extraerServidoresHD()
        console.log(urls)
    }, [id, episodio]);

    useEffect(() => {

        let timer = setTimeout(() => { }, 0);

        const showBtns = () => {
            setHideBtnsAll(false)
            setStyleBtns({ opacity: 1 })

            clearTimeout(timer)

            timer = setTimeout(() => {
                setHideBtnsAll(true)
                setStyleBtns({ opacity: 0 })
            }, 2100)
        }

        window.addEventListener('mousemove', showBtns)

        return () => { clearTimeout(timer); window.removeEventListener('mousemove', showBtns) }

    }, []);


    useEffect(() => {
        window.addEventListener('resize', () => setIsMobile(mediaQuery.matches))
    }, [mediaQuery])

    return (
        <div className="player-container">
            {!isMobile ? (
                <>
                    <div className="btns" style={styleBtns}>
                        <button className="btn-back" onClick={() => navigate(`/anime/${id?.slice(0, id.lastIndexOf('-'))}`)}>X</button>
                        <div className="servers">
                            <button className="btn-info" onClick={verServers}>Cambiar servidor</button>
                            <ul className="list-servers">
                                {urls.map((servidor, index) => (
                                    <li key={index} onClick={() => setServer(servidor.nombre)}>
                                        {servidor.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="btn-fullscreen" onClick={FullScreen} onMouseEnter={() => setColor('#9330ef')} onMouseLeave={() => setColor('#8b8b8b')} ><FullScreenSvg color={color} status={status} /></button>
                    </div>

                    <div className="btns-caps" style={styleBtns}>
                        <button className="btn-backCap" onClick={BackCap}>←</button>
                        <button className="btn-nextCap" onClick={NextCap}>→</button>
                    </div>

                    <div className="meta" style={styleBtns}>
                        <h3>{titulo}</h3>
                        <p>{`Capítulo ${parseInt(id?.match(/\d+$/)?.[0] || "0")}`}</p>
                    </div>

                    <div className="bacground" style={styleBtns}></div>

                    {loading ? <Loading /> : <div className="iframe">
                        {urls.length > 0 && (
                            <iframe
                                className="video-iframe"
                                src={changeServer ? changeServer.url : urls[0].url}
                            />
                        )}
                    </div>}
                </>
            ) : (
                <div className="modal">
                    <div className="modal-content">
                        <h2>¡Atención!</h2>
                        <p>Para una mejor experiencia, se recomienda rotar el movil a horizontal</p>
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9436 1.25H12.0564C13.8942 1.24998 15.3498 1.24997 16.489 1.40314C17.6614 1.56076 18.6104 1.89288 19.3588 2.64124C20.1071 3.38961 20.4392 4.33856 20.5969 5.51098C20.75 6.65019 20.75 8.10583 20.75 9.94359V14.0564C20.75 15.8942 20.75 17.3498 20.5969 18.489C20.4392 19.6614 20.1071 20.6104 19.3588 21.3588C18.6104 22.1071 17.6614 22.4392 16.489 22.5969C15.3498 22.75 13.8942 22.75 12.0564 22.75H11.9436C10.1058 22.75 8.65019 22.75 7.51098 22.5969C6.33856 22.4392 5.38961 22.1071 4.64124 21.3588C3.89288 20.6104 3.56076 19.6614 3.40314 18.489C3.24997 17.3498 3.24998 15.8942 3.25 14.0564V9.94358C3.24998 8.10582 3.24997 6.65019 3.40314 5.51098C3.56076 4.33856 3.89288 3.38961 4.64124 2.64124C5.38961 1.89288 6.33856 1.56076 7.51098 1.40314C8.65019 1.24997 10.1058 1.24998 11.9436 1.25ZM7.71085 2.88976C6.70476 3.02502 6.12511 3.27869 5.7019 3.7019C5.27869 4.12511 5.02502 4.70476 4.88976 5.71085C4.75159 6.73851 4.75 8.09318 4.75 10V14C4.75 15.9068 4.75159 17.2615 4.88976 18.2892C5.02502 19.2952 5.27869 19.8749 5.7019 20.2981C6.12511 20.7213 6.70476 20.975 7.71085 21.1102C8.73851 21.2484 10.0932 21.25 12 21.25C13.9068 21.25 15.2615 21.2484 16.2892 21.1102C17.2952 20.975 17.8749 20.7213 18.2981 20.2981C18.7213 19.8749 18.975 19.2952 19.1102 18.2892C19.2484 17.2615 19.25 15.9068 19.25 14V10C19.25 8.09318 19.2484 6.73851 19.1102 5.71085C18.975 4.70476 18.7213 4.12511 18.2981 3.7019C17.8749 3.27869 17.2952 3.02502 16.2892 2.88976C15.2615 2.75159 13.9068 2.75 12 2.75C10.0932 2.75 8.73851 2.75159 7.71085 2.88976ZM8.25 19C8.25 18.5858 8.58579 18.25 9 18.25H15C15.4142 18.25 15.75 18.5858 15.75 19C15.75 19.4142 15.4142 19.75 15 19.75H9C8.58579 19.75 8.25 19.4142 8.25 19Z" fill="#7030ef"></path> </g></svg>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ver;