import { Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Home from './pages/home';
import Browse from './pages/browse';
import Directorio from './pages/directorio';
import AnimeDetalle from './pages/anime';
import Reproductor from './pages/ver';
import NavBar from './components/NavBar';
import Construction from './pages/construction';

function App() {
  const location = useLocation();
  const pathVer = location.pathname.startsWith("/ver");

  return (
    <>
      {!pathVer && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/directorio" element={<Directorio />} />

        {/* Rutas con parámetros dinámicos (:id) */}
        <Route path="/anime/:id" element={<AnimeDetalle />} />
        <Route path="/ver/:id" element={<Reproductor />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<h1>404 - No encontrado</h1>} />
        <Route path="/construction" element={<Construction />} />
      </Routes>
    </>
  );
}

export default App;
