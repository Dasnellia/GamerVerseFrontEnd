import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import type { ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "react-bootstrap";

import "../../css/BarraNav.css";
import Logo from "../../imagenes/LogoRecuperarContraseña.png";
import type { Juego } from "./DetalleJuego";

function BarraNav({ onAbrirFiltroLateral }: { onAbrirFiltroLateral: () => void }) {
  const location = useLocation();
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [todosLosJuegos, setTodosLosJuegos] = useState<Juego[]>([]);
  const [sugerencias, setSugerencias] = useState<Juego[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/juegos")
      .then(res => res.json())
      .then((data: Juego[]) => setTodosLosJuegos(data))
      .catch(err => console.error("Error cargando juegos:", err));
  }, []);

  useEffect(() => {
    if (nombreBusqueda.trim().length === 0) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const sugerenciasFiltradas = todosLosJuegos
      .filter(j => j.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase()))
      .slice(0, 5); // Limita a 5 sugerencias

    setSugerencias(sugerenciasFiltradas);
    setMostrarSugerencias(sugerenciasFiltradas.length > 0);
  }, [nombreBusqueda, todosLosJuegos]);

  const handleBuscar = () => {
    // Redireccionar a la página de catálogo con el término de búsqueda
    window.location.href = `/Catalogo?busqueda=${encodeURIComponent(nombreBusqueda)}`;
  };

  const handleSeleccionarSugerencia = (nombre: string) => {
    setNombreBusqueda(nombre);
    setSugerencias([]);
    setMostrarSugerencias(false);
    window.location.href = `/Catalogo?busqueda=${encodeURIComponent(nombre)}`;
  };

  return (
    <div id="inicio-page-container">
      {/* Barra superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Inicio">
            <img
              src={Logo}
              alt="Game Verse Logo"
              className="rounded-circle border border-danger"
              width={40}
              height={40}
            />
            <span className="ms-2">Game Verse</span>
          </Link>

          <form className="d-flex mx-auto position-relative" style={{ width: "50%" }}>
            {location.pathname === "/Catalogo" && (
              <button
                className="btn btn-outline-light me-2"
                type="button"
                onClick={onAbrirFiltroLateral}
                title="Abrir filtros"
              >
                <i className="bi bi-sliders"></i>
              </button>
            )}

            <input
              ref={inputRef}
              className="form-control me-2"
              type="search"
              placeholder="Buscar juegos..."
              value={nombreBusqueda}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNombreBusqueda(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            />

            <button className="btn btn-outline-light" type="button" onClick={handleBuscar}>
              Buscar
            </button>

            {mostrarSugerencias && (
              <ul className="list-group position-absolute w-100 mt-5 zindex-tooltip">
                {sugerencias.map((juego) => (
                  <li
                    key={juego.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSeleccionarSugerencia(juego.nombre)}
                    role="button"
                  >
                    {juego.nombre}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <Link className="btn btn-sm btn-outline-light" to="/Perfil">
            <i className="bi bi-person-fill me-1"></i> Mi Cuenta
          </Link>
        </div>
      </nav>

      {/* Barra de navegación secundaria */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul className="nav justify-content-center w-100 gap-3">
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm">Inicio</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">Ofertas</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">Próximos lanzamientos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <li className="nav-item">
              <Link className="nav-link" to="/Catalogo">Catálogo</Link>
            </li>

            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm">Plataformas</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Catalogo">PC</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">PlayStation 5</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">Xbox</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">Nintendo Switch</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <li className="nav-item">
              <Link className="nav-link" to="/MasVendidos">Más vendidos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/MejorValorados">Mejor valorados</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/Carrito">
                <i className="bi bi-cart-fill me-1"></i> Carrito
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default BarraNav;