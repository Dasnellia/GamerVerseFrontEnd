import BarraCarrito from "../carrito/BarraCarrito";
import { handleAgregarAlCarrito } from "../carrito/DetalleCarrito";
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../../css/BarraNav.css";
import { Dropdown } from "react-bootstrap";

import type { Juego as JuegoCompleto, Comentario } from "./DetalleJuego";

import { productosIniciales } from "./DetalleJuego";

import Logo from "../../imagenes/LogoRecuperarContraseña.png";

// Interfaz para la información básica de un juego
interface JuegoBasico {
  id: number;
  nombre: string;
  precio: number;
  plataformas: string[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
}

const juegosIniciales: JuegoBasico[] = productosIniciales.map((juego) => ({
  id: juego.id,
  nombre: juego.nombre,
  precio: juego.precio,
  plataformas: juego.plataformas,
  descuento: juego.descuento,
  rating: juego.rating,
  imagen: juego.imagen,
  descripcion: juego.descripcion,
}));

function BarraNav() {
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [juegosFiltrados, setJuegosFiltrados] =
    useState<JuegoBasico[]>(juegosIniciales);
  const referenciaBusqueda = useRef<HTMLInputElement>(null);
  const [juegoSeleccionado, setJuegoSeleccionado] =
    useState<JuegoCompleto | null>(null);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<JuegoBasico[]>(
    []
  );
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] =
    useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = (juegoId: number) => {
    const juegoCompleto = productosIniciales.find((p) => p.id === juegoId);
    if (juegoCompleto) {
      setJuegoSeleccionado(juegoCompleto);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setJuegoSeleccionado(null);
  };

  const agregarComentario = (
    juegoId: number,
    comentario: Omit<Comentario, "id" | "date">
  ) => {
    if (!juegoSeleccionado) return;

    const juegoActualizado: JuegoCompleto = {
      ...juegoSeleccionado,
      comentarios: [
        ...juegoSeleccionado.comentarios,
        {
          id: juegoSeleccionado.comentarios.length + 1,
          ...comentario,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    };

    setJuegoSeleccionado(juegoActualizado);

    const index = productosIniciales.findIndex((p) => p.id === juegoId);
    if (index !== -1) {
      productosIniciales[index] = juegoActualizado;
    }
  };

  const parseFecha = (fecha: string): Date => {
    const [dia, mes, anio] = fecha.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
  };

  const filtrarJuegos = () => {
    const nombreFiltrado = nombreBusqueda.toLowerCase();

    const nuevosJuegosFiltrados = productosIniciales
      .filter((juego) => {
        return juego.nombre.toLowerCase().includes(nombreFiltrado);
      })
      .sort((a, b) => {
        return (
          parseFecha(b.lanzamiento).getTime() -
          parseFecha(a.lanzamiento).getTime()
        );
      })
      .slice(0, 10)
      .map((juego) => ({
        id: juego.id,
        nombre: juego.nombre,
        precio: juego.precio,
        plataformas: juego.plataformas,
        descuento: juego.descuento,
        rating: juego.rating,
        imagen: juego.imagen,
        descripcion: juego.descripcion,
      }));

    setJuegosFiltrados(nuevosJuegosFiltrados);
  };

  const manejarCambioNombre = (evento: ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = evento.target.value;
    setNombreBusqueda(nuevoNombre);

    const nuevasSugerencias = juegosIniciales.filter(
      (juego) =>
        juego.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()) &&
        nuevoNombre.length > 0
    );
    setSugerenciasBusqueda(nuevasSugerencias);
    setMostrarResultadosBusqueda(nuevasSugerencias.length > 0);
  };

  const manejarClickBuscar = () => {
    filtrarJuegos();
    setMostrarResultadosBusqueda(false);
  };

  const seleccionarSugerencia = (nombreSugerencia: string) => {
    setNombreBusqueda(nombreSugerencia);
    setSugerenciasBusqueda([]);
    setMostrarResultadosBusqueda(false);
    filtrarJuegos();
  };

  useEffect(() => {
    filtrarJuegos();
  }, [nombreBusqueda]);

  return (
    <div id="inicio-page-container">
      {/* Barra de navegación superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Inicio">
            <img
              src={Logo}
              alt="Game Verse Logo"
              className="rounded-circle border border-danger"
            />{" "}
            Game Verse
          </Link>

          {/* Barra de búsqueda */}
          <form
            className="d-flex mx-auto position-relative"
            id="barraBusquedaContainer"
          >
            <input
              ref={referenciaBusqueda}
              className="form-control me-2"
              type="search"
              placeholder="Buscar juegos..."
              aria-label="Buscar"
              value={nombreBusqueda}
              onChange={manejarCambioNombre}
            />
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={manejarClickBuscar}
            >
              Buscar
            </button>

            {/* Sugerencias */}
            {mostrarResultadosBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul
                className="list-group position-absolute w-100 bg-light border rounded shadow-sm"
                style={{ zIndex: 1000 }}
              >
                {sugerenciasBusqueda.map((juego) => (
                  <li
                    key={juego.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => seleccionarSugerencia(juego.nombre)}
                  >
                    {juego.nombre}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <Link className="btn btn-sm btn-outline-light" to="/Perfil">
            <i
              className="bi bi-person-fill"
              style={{ fontStyle: "normal" }}
            ></i>
            <span className="mi-cuenta-texto"> Mi Cuenta </span>
          </Link>
        </div>
      </nav>

      {/* Barra de navegación secundaria */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul
            className="nav justify-content-center w-100"
            style={{ gap: "10px" }}
          >
            <Dropdown>
              <Dropdown.Toggle>Inicio</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Inicio">
                  Destacados
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">
                  Ofertas
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">
                  Próximos lanzamientos
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <li className="nav-item">
              <Link className="nav-link" to="/Catalogo">
                Catálogo
              </Link>
            </li>

            <Dropdown>
              <Dropdown.Toggle>Plataformas</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Catalogo">
                  PC
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">
                  PlayStation 5
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">
                  Xbox
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">
                  Nintendo Switch
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <li className="nav-item">
              <Link className="nav-link" to="/MasVendidos">
                Más vendidos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/MejorValorados">
                Mejor valorados
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/Carrito"
              >
                <i className="bi bi-cart-fill me-1"></i>Carrito
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default BarraNav;
