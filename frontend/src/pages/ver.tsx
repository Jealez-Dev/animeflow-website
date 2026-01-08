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

    const fetchCap = () => {
        fetch('/api/SeleccionCap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_anime: id }),
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
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

        console.log(NumBase)
        console.log(cantCap)

        if (NumBase == cantCap) {
            disablebtnNew?.classList.add('nothing')
            console.log('disablebtnNew')
        } else {
            disablebtnNew?.classList.remove('nothing')
            console.log('enablebtnNew')
        }

        if (NumBase == 1) {
            disablebtnBack?.classList.add('nothing')
            console.log('disablebtnBack')
        } else {
            disablebtnBack?.classList.remove('nothing')
            console.log('enablebtnBack')
        }

    }

    const FullScreen = () => {
        const iframe = document.querySelector('.btn-fullscreen')
        setStatusFullscreen(!status)

        if (status) {
            document.exitFullscreen()
        } else {
            document.documentElement.requestFullscreen()
        }
    }

    const changeServer = urls.find(
        item => item.nombre === server
    )

    disableNavBtns()

    useEffect(() => {
        fetchCap();
        fetchCapitulos(id ? id?.slice(0, id.lastIndexOf('-')) : '');
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

    return (
        <div className="player-container">
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
        </div>
    );
}

export default ver;