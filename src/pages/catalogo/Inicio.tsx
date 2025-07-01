import BarraCarrito from '../carrito/BarraCarrito'; 
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';
import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Inicio.css';
import { Dropdown } from 'react-bootstrap';

// Componentes y Tipos
import Footer from './Footer';
import type { Juego as JuegoCompleto, Comentario } from './DetalleJuego';
import DetalleJuego from './DetalleJuego';
import { productosIniciales } from './DetalleJuego';

// Importar imágenes de banners y logo
import Banner1 from '../../imagenes/Verano.png';
import Banner2 from '../../imagenes/Promo.png';
import Banner3 from '../../imagenes/Juego-Nuevo.png';
import Logo from '../../imagenes/LogoRecuperarContraseña.png';

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

const juegosIniciales: JuegoBasico[] = productosIniciales.map(juego => ({
  id: juego.id,
  nombre: juego.nombre,
  precio: juego.precio,
  plataformas: juego.plataformas,
  descuento: juego.descuento,
  rating: juego.rating,
  imagen: juego.imagen,
  descripcion: juego.descripcion
}));

function Inicio() {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [juegosFiltrados, setJuegosFiltrados] = useState<JuegoBasico[]>(juegosIniciales);
  const referenciaBusqueda = useRef<HTMLInputElement>(null);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<JuegoBasico[]>([]);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = (juegoId: number) => {
    const juegoCompleto = productosIniciales.find(p => p.id === juegoId);
    if (juegoCompleto) {
      setJuegoSeleccionado(juegoCompleto);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setJuegoSeleccionado(null);
  };

  const agregarComentario = (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => {
    if (!juegoSeleccionado) return;

    const juegoActualizado: JuegoCompleto = {
      ...juegoSeleccionado,
      comentarios: [
        ...juegoSeleccionado.comentarios,
        {
          id: juegoSeleccionado.comentarios.length + 1,
          ...comentario,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setJuegoSeleccionado(juegoActualizado);

    const index = productosIniciales.findIndex(p => p.id === juegoId);
    if (index !== -1) {
      productosIniciales[index] = juegoActualizado;
    }
  };

  const parseFecha = (fecha: string): Date => {
  const [dia, mes, anio] = fecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia); 
  };

  const filtrarJuegos = () => {
    const nombreFiltrado = nombreBusqueda.toLowerCase();

    const nuevosJuegosFiltrados = productosIniciales
      .filter(juego => {
        return juego.nombre.toLowerCase().includes(nombreFiltrado);
      })
      .sort((a, b) => {
        return parseFecha(b.lanzamiento).getTime() - parseFecha(a.lanzamiento).getTime();
      })
      .slice(0, 10)
      .map(juego => ({
        id: juego.id,
        nombre: juego.nombre,
        precio: juego.precio,
        plataformas: juego.plataformas,
        descuento: juego.descuento,
        rating: juego.rating,
        imagen: juego.imagen,
        descripcion: juego.descripcion
      }));

    setJuegosFiltrados(nuevosJuegosFiltrados);
  };

  const manejarCambioNombre = (evento: ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = evento.target.value;
    setNombreBusqueda(nuevoNombre);

    const nuevasSugerencias = juegosIniciales.filter(juego =>
      juego.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()) && nuevoNombre.length > 0
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
            <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger" /> Game Verse
          </Link>

          {/* Barra de búsqueda con sugerencias */}
          <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
            <input
              ref={referenciaBusqueda}
              className="form-control me-4"
              type="search"
              placeholder="Buscar juegos..."
              aria-label="Buscar"
              value={nombreBusqueda}
              onChange={manejarCambioNombre}
            />
            <button className="btn btn-outline-light" type="button" onClick={manejarClickBuscar}>
              Buscar
            </button>

            {/* Sugerencias de búsqueda */}
            {mostrarResultadosBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul className="list-group position-absolute w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000 }}>
                {sugerenciasBusqueda.map(juego => (
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

          {/* Botón Mi Cuenta */}
          <Link className="btn btn-sm btn-outline-light" to="/Perfil">
            <i className="bi bi-person-fill" style={{ fontStyle: 'normal' }}> Mi Cuenta </i>
          </Link>
        </div>
      </nav>

      {/* Barra de navegación secundaria */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <div className="w-100">
            <ul className="nav justify-content-center">
              <Dropdown>
                <Dropdown.Toggle>
                  Inicio
                </Dropdown.Toggle>
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
                <Dropdown.Toggle>
                  Plataformas
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/Catalogo">PC</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Catalogo">Play Station 5</Dropdown.Item>
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
                <Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill"></i>Carrito</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Listado de juegos */}
          <div className="col">
            {/* Carrusel de Banners */}
            <div className="container">
              <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner rounded">
                  <div className="carousel-item active">
                    <img src={Banner1} className="d-block w-100" alt="Ofertas de Verano" />
                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                      <h5>Ofertas de Verano</h5>
                      <p>Hasta 70% de descuento en juegos seleccionados</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img src={Banner3} className="d-block w-100" alt="Nuevos Lanzamientos" />
                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                      <h5>Nuevos Lanzamientos</h5>
                      <p>Descubre los juegos más recientes</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img src={Banner2} className="d-block w-100" alt="Ediciones Coleccionistas" />
                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                      <h5>Ediciones Coleccionistas</h5>
                      <p>Artículos exclusivos para los verdaderos fans</p>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </div>
            </div>

            {/* Título y listado de juegos destacados */}
            <div className="container mt-5">
              <h1 className="page-title">Juegos Destacados</h1>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {juegosFiltrados.map(juego => (
                  <div className="col" key={juego.id}>
                    <div className="card h-100">
                      {juego.descuento > 0 && <div className="discount-badge">-{juego.descuento}%</div>}
                      <img
                        src={juego.imagen}
                        className="card-img-top game-cover"
                        alt={juego.nombre}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'ruta/a/imagen/placeholder.jpg';
                        }}
                      />
                      <div id="toast" className="toast"></div>
                      <div className="card-body">
                        <h5 className="card-title">{juego.nombre}</h5>
                        <div className="mb-2">
                          {juego.plataformas?.map(plataforma => (
                            <span key={plataforma} className="badge bg-secondary platform-badge">{plataforma}</span>
                          ))}
                        </div>
                        <p className="card-text">{juego.descripcion?.substring(0, 80)}...</p>
                        <div className="rating mb-2">
                          {[...Array(Math.floor(juego.rating))].map((_, i) => (
                            <i key={`star-full-${juego.id}-${i}`} className="bi bi-star-fill text-warning"></i>
                          ))}
                          {juego.rating % 1 !== 0 && <i className="bi bi-star-half text-warning"></i>}
                          {[...Array(5 - Math.ceil(juego.rating))].map((_, i) => (
                            <i key={`star-empty-${juego.id}-${i}`} className="bi bi-star text-warning"></i>
                          ))}
                          <span className="text-muted ms-2">{juego.rating}/5</span>
                        </div>
                        <p className="price">
                          {juego.descuento > 0 && (
                            <span className="old-price">S/ {(juego.precio / (1 - juego.descuento / 100)).toFixed(2)}</span>
                          )}
                          <span>S/ {juego.precio.toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between">
                        <button
                            className="btn btn-sm btn-primary"
                            data-id={juego.id}
                            data-nombre={juego.nombre}
                            data-precio={juego.precio.toFixed(2)}
                            data-imagen={juego.imagen}
                            onClick={handleAgregarAlCarrito}
                        >
                            Agregar al carrito
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => abrirModal(juego.id)}
                        >
                          Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {juegosFiltrados.length === 0 && nombreBusqueda && (
                  <div className="col-12 text-center">
                    <p>No se encontraron juegos para "{nombreBusqueda}".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles del juego */}
      {juegoSeleccionado && (
        <DetalleJuego
          juego={juegoSeleccionado}
          show={mostrarModal}
          onHide={cerrarModal}
          onAddComment={agregarComentario}
        />
      )}
      <BarraCarrito />
      <Footer />
    </div>  
  );
}
export default Inicio;