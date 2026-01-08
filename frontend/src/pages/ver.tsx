import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading2";

function ver() {

    const { id, episodio } = useParams();
    const [urls, setUrls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [overlay, setOverlay] = useState(false)
    const [server, setServer] = useState('')
    const [Capitulos, setCapitulos] = useState()
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
        fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(id || '')}&limit=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCapitulos(data.data[0].episodes)
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

    const changeServer = urls.find(
        item => item.nombre === server
    )

    disableNavBtns()

    useEffect(() => {
        fetchCap();
        fetchCapitulos(id ? id?.slice(0, id.lastIndexOf('-')) : '');
    }, [id, episodio]);

    return (
        <div className="player-container">
            <div className="btns">
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
            </div>

            <div className="btns-caps">
                <button className="btn-backCap" onClick={BackCap}>←</button>
                <button className="btn-nextCap" onClick={NextCap}>→</button>
            </div>


            {loading ? <Loading /> : <div className="iframe">
                {urls.length > 0 && (
                    <iframe
                        className="video-iframe"
                        src={changeServer ? changeServer.url : urls[0].url}
                        allowFullScreen
                    />
                )}
            </div>}
        </div>
    );
}

export default ver;