import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBar() {

    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/browse?q=${search}`);
        }
    };

    return (
        <header className="header">
            <h1 className="header-title">Anime<span>Flow</span></h1>
            <nav className="header-nav">
                <ul className="header-nav-list">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/construction">Directorio</Link></li>
                </ul>
                <form onSubmit={handleSearch} className="header-search">
                    <input type="text" id="search" className="header-search-input" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                </form>
            </nav>
        </header>
    );
}

export default NavBar;
