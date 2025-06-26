import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import type { Juego as JuegoCompleto } from './DetalleJuego';
import type { Comentario } from './DetalleJuego';
import DetalleJuego from './DetalleJuego';
import Footer from './Footer';
import BarraCarrito from '../carrito/BarraCarrito';
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';
import Banner1 from '../../imagenes/Verano.png';
import Banner2 from '../../imagenes/Promo.png';
import Banner3 from '../../imagenes/Juego-Nuevo.png';
import Logo from '../../imagenes/LogoRecuperarContraseña.png';
import '../../css/Inicio.css';

function Inicio() {
  const [juegos, setJuegos] = useState<JuegoCompleto[]>([]);
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<JuegoCompleto[]>([]);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
  const referenciaBusqueda = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/juegos')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a: JuegoCompleto, b: JuegoCompleto) => new Date(b.lanzamiento).getTime() - new Date(a.lanzamiento).getTime());
        setJuegos(ordenados.slice(0, 10));
      })
      .catch(err => console.error('Error al cargar juegos:', err));
  }, []);

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nombre = e.target.value;
    setNombreBusqueda(nombre);
    const sugerencias = juegos.filter(j => j.nombre.toLowerCase().includes(nombre.toLowerCase()));
    setSugerenciasBusqueda(sugerencias);
    setMostrarResultadosBusqueda(nombre.length > 0);
  };

  const manejarClickBuscar = () => {
    fetch('http://localhost:3001/api/juegos')
      .then(res => res.json())
      .then(data => {
        const filtrados = data.filter((j: JuegoCompleto) => j.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase()));
        setJuegos(filtrados.slice(0, 10));
      });
    setMostrarResultadosBusqueda(false);
  };

  const seleccionarSugerencia = (nombre: string) => {
    setNombreBusqueda(nombre);
    setSugerenciasBusqueda([]);
    setMostrarResultadosBusqueda(false);
    fetch('http://localhost:3001/api/juegos')
      .then(res => res.json())
      .then(data => {
        const exacto = data.filter((j: JuegoCompleto) => j.nombre === nombre);
        setJuegos(exacto);
      });
  };

  const abrirModal = (juego: JuegoCompleto) => {
    setJuegoSeleccionado(juego);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setJuegoSeleccionado(null);
    setMostrarModal(false);
  };

  const agregarComentario = (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => {
    if (!juegoSeleccionado) return;
    const actualizado: JuegoCompleto = {
      ...juegoSeleccionado,
      comentarios: [
        ...juegoSeleccionado.comentarios,
        { id: juegoSeleccionado.comentarios.length + 1, ...comentario, date: new Date().toISOString() }
      ]
    };
    setJuegoSeleccionado(actualizado);
  };

  return (
    <div id="inicio-page-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Inicio">
            <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger" /> Game Verse
          </Link>
          <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
            <input ref={referenciaBusqueda} className="form-control me-4" type="search" placeholder="Buscar juegos..." value={nombreBusqueda} onChange={manejarCambioNombre} />
            <button className="btn btn-outline-light" type="button" onClick={manejarClickBuscar}>Buscar</button>
            {mostrarResultadosBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul className="list-group position-absolute w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000 }}>
                {sugerenciasBusqueda.map(j => (
                  <li key={j.id} className="list-group-item list-group-item-action" onClick={() => seleccionarSugerencia(j.nombre)}>{j.nombre}</li>
                ))}
              </ul>
            )}
          </form>
          <Link className="btn btn-sm btn-outline-light" to="/Perfil"><i className="bi bi-person-fill"> Mi Cuenta </i></Link>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul className="nav justify-content-center w-100">
            <Dropdown><Dropdown.Toggle>Inicio</Dropdown.Toggle><Dropdown.Menu><Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item></Dropdown.Menu></Dropdown>
            <li className="nav-item"><Link className="nav-link" to="/Catalogo">Catálogo</Link></li>
            <Dropdown><Dropdown.Toggle>Plataformas</Dropdown.Toggle><Dropdown.Menu><Dropdown.Item>PC</Dropdown.Item><Dropdown.Item>PS5</Dropdown.Item></Dropdown.Menu></Dropdown>
            <li className="nav-item"><Link className="nav-link" to="/MasVendidos">Más vendidos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill"></i> Carrito</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner rounded">
            {[Banner1, Banner3, Banner2].map((img, idx) => (
              <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}><img src={img} className="d-block w-100" /></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h1 className="page-title">Juegos Destacados</h1>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {juegos.map(juego => (
            <div className="col" key={juego.id}>
              <div className="card h-100">
                {juego.descuento > 0 && <div className="discount-badge">-{juego.descuento}%</div>}
                <img src={juego.imagen} className="card-img-top game-cover" alt={juego.nombre} />
                <div className="card-body">
                  <h5 className="card-title">{juego.nombre}</h5>
                  <div className="mb-2">
                    {juego.plataformas.map(p => <span key={p} className="badge bg-secondary me-1">{p}</span>)}
                  </div>
                  <p className="card-text">{juego.descripcion?.substring(0, 80)}...</p>
                  <div className="rating mb-2">
                    {[...Array(5)].map((_, i) => <i key={i} className={`bi ${i < Math.round(juego.rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>)}
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
                  <button className="btn btn-sm btn-primary" data-id={juego.id} data-nombre={juego.nombre} data-precio={juego.precio} data-imagen={juego.imagen} onClick={(e) => {
                    handleAgregarAlCarrito(e);
                    setTimeout(() => window.location.reload(), 500);
                  }}>Agregar al carrito</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => abrirModal(juego)}>Detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {juegoSeleccionado && (
        <DetalleJuego juego={juegoSeleccionado} show={mostrarModal} onHide={cerrarModal} onAddComment={agregarComentario} />
      )}

      <BarraCarrito />
      <Footer />
    </div>
  );
}

export default Inicio;