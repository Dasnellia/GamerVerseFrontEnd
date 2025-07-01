import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Catalogo.css'; // Mantenemos tu CSS para el catálogo
import 'rc-slider/assets/index.css';
import Logo from '../../imagenes/LogoRecuperarContraseña.png';
import Footer from './Footer';
import DetalleJuego, { productosIniciales, type Comentario } from './DetalleJuego';
import type { Juego as JuegoCompleto } from './DetalleJuego';
import BarraCarrito from '../carrito/BarraCarrito';
import { mostrarMensajeToast, handleAgregarAlCarrito as handleAgregarAlCarritoBase } from '../carrito/DetalleCarrito';
import Slider from 'rc-slider';

// Importar el componente Dropdown de react-bootstrap
import { Dropdown } from 'react-bootstrap';


function Catalogo() {
  // --- Estados del Componente ---
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(productosIniciales);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<typeof productosIniciales>([]);
  const [mostrarSugerenciasBusqueda, setMostrarSugerenciasBusqueda] = useState(false);
  const refBusqueda = useRef<HTMLInputElement>(null);
  const maxPrecioDisponible = Math.max(...productosIniciales.map(p => p.precio));
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, maxPrecioDisponible]);
  const [mostrarFiltroLateral, setMostrarFiltroLateral] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false); // Corregido el useState aquí
  const [listaProductos, setListaProductos] = useState(productosIniciales);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<string[]>([]);

  // --- Funciones de Manejo de Filtros y Búsqueda ---

  const handleCambioRangoPrecio = (valor: number | number[]) => {
    if (Array.isArray(valor)) {
      setRangoPrecio([valor[0], valor[1]]);
    }
  };

  const aplicarFiltrosProductos = () => {
    const nombreNormalizado = nombreBusqueda.toLowerCase();
    const [precioMinimo, precioMaximo] = rangoPrecio;

    const productosFiltradosActuales = listaProductos.filter(producto => {
      const coincideNombre = producto.nombre.toLowerCase().includes(nombreNormalizado);
      const coincidePrecio = producto.precio >= precioMinimo && producto.precio <= precioMaximo;
      const coincidePlataforma = plataformasSeleccionadas.length === 0 ||
        producto.plataformas.some(p => plataformasSeleccionadas.includes(p));

      return coincideNombre && coincidePrecio && coincidePlataforma;
    });

    setProductosFiltrados(productosFiltradosActuales);
  };

  useEffect(() => {
    aplicarFiltrosProductos();
  }, [nombreBusqueda, rangoPrecio, plataformasSeleccionadas, listaProductos]);

  const obtenerTodasLasPlataformas = [...new Set(productosIniciales.flatMap(p => p.plataformas))];

  const handleAgregarJuegoAlCarrito = (evento: React.MouseEvent<HTMLButtonElement>) => {
    const boton = evento.currentTarget;
    const id = parseInt(boton.dataset.id || '', 10);
    const nombre = boton.dataset.nombre;
    const precioString = boton.dataset.precio;
    const precio = precioString ? parseFloat(precioString) : undefined;
    const imagen = boton.dataset.imagen;

    if (id && nombre && precio !== undefined && imagen) {
      handleAgregarAlCarritoBase(evento);
      mostrarMensajeToast(`¡"${nombre}" ha sido añadido al carrito!`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleCambioNombreBusqueda = (evento: ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = evento.target.value;
    setNombreBusqueda(nuevoNombre);

    const nuevasSugerencias = listaProductos.filter(producto =>
      producto.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()) && nuevoNombre.length > 0
    );
    setSugerenciasBusqueda(nuevasSugerencias);
    setMostrarSugerenciasBusqueda(nuevasSugerencias.length > 0);
  };

  const handleClicBuscar = () => {
    aplicarFiltrosProductos();
    setMostrarSugerenciasBusqueda(false);
    mostrarMensajeToast(`Búsqueda realizada para: "${nombreBusqueda}"`);
  };

  const seleccionarSugerenciaBusqueda = (nombre: string) => {
    setNombreBusqueda(nombre);
    setSugerenciasBusqueda([]);
    setMostrarSugerenciasBusqueda(false);
    aplicarFiltrosProductos();
  };

  const alternarFiltroLateral = () => {
    setMostrarFiltroLateral(!mostrarFiltroLateral);
  };

  const handleCambioPlataforma = (evento: ChangeEvent<HTMLInputElement>) => {
    const plataforma = evento.target.value;
    const estaMarcado = evento.target.checked;

    setPlataformasSeleccionadas(prev => {
      if (estaMarcado) {
        return [...prev, plataforma];
      } else {
        return prev.filter(p => p !== plataforma);
      }
    });
  };

  const handleAgregarComentario = (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => {
    setListaProductos(prevProductos =>
      prevProductos.map(juego => {
        if (juego.id === juegoId) {
          const nuevoComentario = {
            ...comentario,
            id: juego.comentarios.length + 1,
            date: new Date().toISOString().split('T')[0]
          };
          return {
            ...juego,
            comentarios: [...juego.comentarios, nuevoComentario]
          };
        }
        return juego;
      })
    );

    if (juegoSeleccionado && juegoSeleccionado.id === juegoId) {
      const nuevoComentario = {
        ...comentario,
        id: juegoSeleccionado.comentarios.length + 1,
        date: new Date().toISOString().split('T')[0]
      };
      setJuegoSeleccionado({
        ...juegoSeleccionado,
        comentarios: [...juegoSeleccionado.comentarios, nuevoComentario]
      });
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div id="catalogo-page-container"> {/* El nuevo contenedor principal */}
      {/* Barra de navegación superior (sin cambios, ya era similar a Inicio) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Inicio">
            <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger" /> Game Verse
          </Link>

          <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
            <button className="btn btn-outline-light me-2" type="button" onClick={alternarFiltroLateral}>
              <i className="bi bi-sliders"></i>
            </button>
            <input
              ref={refBusqueda}
              className="form-control me-4"
              type="search"
              placeholder="Buscar juegos..."
              aria-label="Buscar"
              value={nombreBusqueda}
              onChange={handleCambioNombreBusqueda}
            />
            <button className="btn btn-outline-light" type="button" onClick={handleClicBuscar}>
              Buscar
            </button>

            {mostrarSugerenciasBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul className="list-group position-absolute mt-2 w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000, top: '100%' }}>
                {sugerenciasBusqueda.map(producto => (
                  <li
                    key={producto.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => seleccionarSugerenciaBusqueda(producto.nombre)}
                  >
                    {producto.nombre}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <Link className="btn btn-sm btn-outline-light" to="/Perfil">
            <i className="bi bi-person-fill" style={{ fontStyle: 'normal' }}> Mi Cuenta </i>
          </Link>
        </div>
      </nav>

      {/* Segunda barra de navegación con dropdowns (MODIFICADA para usar react-bootstrap) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <div className="w-100">
            <ul className="nav justify-content-center">
              {/* Dropdown "Inicio" con react-bootstrap */}
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle as={Link} to="#" className="nav-link">
                  Inicio
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Inicio">Ofertas</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Inicio">Próximos lanzamientos</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* Enlace directo "Catálogo" */}
              <li className="nav-item">
                <Link className="nav-link" to="/Catalogo">Catálogo</Link>
              </li>
              {/* Dropdown "Plataformas" con react-bootstrap */}
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle as={Link} to="#" className="nav-link">
                  Plataformas
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/Catalogo?platform=PC">PC</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Catalogo?platform=PS5">PlayStation 5</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Catalogo?platform=XBOX">Xbox Series X</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Catalogo?platform=SWITCH">Nintendo Switch</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* Enlaces directos */}
              <li className="nav-item">
                <Link className="nav-link" to="/MasVendidos">Más vendidos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/MejorValorados">Mejor valorados</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill" style={{ fontSize: '1em', marginRight: '0.1em' }}></i> Carrito</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          {mostrarFiltroLateral && (
            <div className="col-md-3 filtro-lateral bg-dark p-3 shadow-sm">
              <h5 className="mb-3">Filtrar por Precio</h5>
              <div className="mb-3">
                <Slider
                  range
                  min={0}
                  max={maxPrecioDisponible}
                  value={rangoPrecio}
                  onChange={handleCambioRangoPrecio}
                  trackStyle={[{ backgroundColor: 'red' }]}
                  handleStyle={[
                    { borderColor: 'red', backgroundColor: 'red' },
                    { borderColor: 'red', backgroundColor: 'red' }
                  ]}
                />
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Min: S/ {rangoPrecio[0].toFixed(2)}</span>
                  <span>Max: S/ {rangoPrecio[1].toFixed(2)}</span>
                </div>
              </div>
              <h5 className="mb-2">Filtrar por Plataforma</h5>
              <div className="d-flex flex-column">
                {obtenerTodasLasPlataformas.map(plataforma => (
                  <div key={plataforma} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={plataforma}
                      id={`plataforma-${plataforma}`}
                      onChange={handleCambioPlataforma}
                      checked={plataformasSeleccionadas.includes(plataforma)}
                    />
                    <label className="form-check-label" htmlFor={`plataforma-${plataforma}`}>
                      {plataforma}
                    </label>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary w-100 mt-3" onClick={alternarFiltroLateral}>
                Cerrar Filtro
              </button>
            </div>
          )}

          <div className={`col ${mostrarFiltroLateral ? 'ms-md-3' : ''}`}>
            <div className="container mt-5">
              <h1 className="page-title">Catálogo de Juegos</h1>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {productosFiltrados.map(producto => (
                  <div className="col" key={producto.id}>
                    <div className="card h-100">
                      {producto.descuento > 0 && (
                        <div className="discount-badge">-{producto.descuento}%</div>
                      )}
                      <img
                        src={producto.imagen}
                        className="card-img-top game-cover"
                        alt={`Portada de ${producto.nombre}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'ruta/a/imagen/placeholder.jpg'; // Considera una imagen de fallback real
                        }}
                      />
                    <div id="toast" className="toast"></div>
                      <div className="card-body">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <div className="mb-2">
                          {producto.plataformas?.map(plataforma => (
                            <span key={plataforma} className="badge bg-secondary platform-badge">
                              {plataforma}
                            </span>
                          ))}
                        </div>
                        <p className="card-text">{producto.descripcion?.substring(0, 80)}...</p>
                        <div className="rating mb-2">
                          {[...Array(Math.floor(producto.rating))].map((_, i) => (
                            <i key={`star-full-${producto.id}-${i}`} className="bi bi-star-fill text-warning"></i>
                          ))}
                          {producto.rating % 1 !== 0 && <i className="bi bi-star-half text-warning"></i>}
                          {[...Array(5 - Math.ceil(producto.rating))].map((_, i) => (
                            <i key={`star-empty-${producto.id}-${i}`} className="bi bi-star text-warning"></i>
                          ))}
                          <span className="text-muted ms-2">{producto.rating}/5</span>
                        </div>
                        <p className="precio">
                          {producto.descuento > 0 && (
                            <span className="old-price">
                              S/ {(producto.precio / (1 - producto.descuento / 100)).toFixed(2)}
                            </span>
                          )}
                          <span>S/ {producto.precio.toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between">
                        <button
                          className="btn btn-sm btn-primary"
                          data-id={producto.id}
                          data-nombre={producto.nombre}
                          data-precio={producto.precio.toFixed(2)}
                          data-imagen={producto.imagen}
                          onClick={handleAgregarJuegoAlCarrito}
                        >
                          Agregar al carrito
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            const juegoCompleto = listaProductos.find(p => p.id === producto.id);
                            if (juegoCompleto) {
                              setJuegoSeleccionado(juegoCompleto);
                              setMostrarModalDetalle(true);
                            }
                          }}
                        >
                          Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {productosFiltrados.length === 0 && (
                  <div className="col-12 text-center">
                    <p>No se encontraron juegos que coincidan con los filtros aplicados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {juegoSeleccionado && (
        <DetalleJuego
          juego={juegoSeleccionado}
          show={mostrarModalDetalle}
          onHide={() => setMostrarModalDetalle(false)}
          onAddComment={handleAgregarComentario}
        />
      )}
      <BarraCarrito />
      <Footer />
    </div> 
  );
}

export default Catalogo;