import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function NavBar() {

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/browse?q=${search}`);
        }
    };

    const btnSearchMobile = () => {
        return <div className="iconos"><svg className="svg-Search" onClick={btnSearch} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></div>
    }

    const btnCloseMobile = () => {
        return <div className="iconos"><svg className="svg-SearchClose" onClick={btnSearch} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#ffffff"></path> </g></svg></div>
    }

    const btnSearch = () => {
        setShowSearch(!showSearch);
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)");

    return (
        /* Muestra el logo si no se muestra la barra de busqueda */
        <header className="header">
            {showSearch ? null : <h1 className="header-title" onClick={() => navigate('/')}>Anime<span>Flow</span></h1>}
            <nav className="header-nav">
                {mediaQuery.matches ? null : ( /* Elimina los textos en la version mobile */
                    <ul className="header-nav-list">
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/directorio">Directorio</Link></li>
                    </ul>
                )}
                {mediaQuery.matches ? showSearch ? /* Solo se muestra cuando el estado es verdadero */
                    /* esconde la barra de busqueda en la version mobile */
                    <form onSubmit={handleSearch} className="header-search">
                        <input type="text" id="search" className="header-search-input" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                    </form> : null
                    :
                    <form onSubmit={handleSearch} className="header-search">
                        <input type="text" id="search" className="header-search-input" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                    </form> /* añado dinamicamente dos iconos */}
                {mediaQuery.matches ? showSearch ? btnCloseMobile() : btnSearchMobile() : null}
            </nav>
        </header>
    );
}

export default NavBar;
