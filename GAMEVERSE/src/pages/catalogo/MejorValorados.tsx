import BarraCarrito from '../carrito/BarraCarrito'; 
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/MejorValorados.css';

import type { Juego as JuegoCompleto, Comentario } from './DetalleJuego';
import DetalleJuego from './DetalleJuego';
import { productosIniciales } from './DetalleJuego';

import Logo from '../../imagenes/LogoRecuperarContraseña.png';
import Footer from './Footer';

function MejorValorados() {
    const [nombreBusqueda, setNombreBusqueda] = useState('');
    const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<JuegoCompleto[]>([]);
    const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
    const referenciaBusqueda = useRef<HTMLInputElement>(null);
    const [juegosFiltrados, setJuegosFiltrados] = useState<JuegoCompleto[]>([]);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = (juegoId: number) => {
        const juegoEncontrado = productosIniciales.find(p => p.id === juegoId);
        if (juegoEncontrado) {
            setJuegoSeleccionado(juegoEncontrado);
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

        const indice = productosIniciales.findIndex(p => p.id === juegoId);
        if (indice !== -1) {
            productosIniciales[indice] = juegoActualizado;
        }
    };

    const manejarCambioNombre = (evento: React.ChangeEvent<HTMLInputElement>) => {
        const valorBusqueda = evento.target.value;
        setNombreBusqueda(valorBusqueda);

        const nuevasSugerencias = productosIniciales.filter(juego =>
            juego.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()) && valorBusqueda.length > 0
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
        setMostrarResultadosBusqueda(false);
        filtrarJuegos(nombreSugerencia);
    };

    const filtrarJuegos = (nombreOpcional?: string) => {
        const valor = (nombreOpcional ?? nombreBusqueda).toLowerCase();

        const juegosResultantes = productosIniciales
            .filter(juego => juego.nombre.toLowerCase().includes(valor))
            .sort((a, b) => b.rating - a.rating);

        setJuegosFiltrados(juegosResultantes);
    };

    useEffect(() => {
        const juegosOrdenados = [...productosIniciales].sort((a, b) => b.rating - a.rating);
        setJuegosFiltrados(juegosOrdenados);
    }, []);

    useEffect(() => {
        filtrarJuegos();
    }, [nombreBusqueda]);

    return (
        <div id="mejor-valorados-page-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/Inicio">
                        <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger me-2" />
                        Game Verse
                    </Link>

                    <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
                        <input
                            ref={referenciaBusqueda}
                            className="form-control me-2"
                            type="search"
                            placeholder="Buscar juegos..."
                            aria-label="Buscar"
                            value={nombreBusqueda}
                            onChange={manejarCambioNombre}
                        />
                        {/* CAMBIO AQUÍ: Añadida la clase 'btn-sm' al botón de Buscar */}
                        <button className="btn btn-outline-light btn-sm me-4" type="button" onClick={manejarClickBuscar}>
                            Buscar
                        </button>

                        {mostrarResultadosBusqueda && sugerenciasBusqueda.length > 0 && (
                            <ul className="list-group position-absolute mt-2 w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000 }}>
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

                    <Link className="btn btn-outline-light btn-sm me-4" to="/Perfil">
                        <i className="bi bi-person-fill"></i> Mi Cuenta
                    </Link>
                </div>
            </nav>

            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div className="w-100">
                        <ul className="nav justify-content-center">
                            <Dropdown className="nav-item">
                                <Dropdown.Toggle variant="dark" className="nav-link" style={{ backgroundColor: 'transparent' }}>
                                    Inicio
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Inicio">Ofertas</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Inicio">Próximos lanzamientos</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <li className="nav-item"><Link className="nav-link" to="/Catalogo">Catálogo</Link></li>
                            <Dropdown className="nav-item">
                                <Dropdown.Toggle variant="dark" className="nav-link" style={{ backgroundColor: 'transparent' }}>
                                    Plataformas
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/Catalogo">PC</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Catalogo">Play Station 5</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Catalogo">Xbox</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Catalogo">Nintendo Switch</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <li className="nav-item"><Link className="nav-link" to="/MasVendidos">Más vendidos</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/MejorValorados">Mejor valorados</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill"></i> Carrito</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <h1 className="mb-4 page-title">Juegos Mejor Valorados</h1>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {juegosFiltrados.map(juego => (
                        <div className="col" key={juego.id}>
                            <div className="card h-100">
                                {juego.descuento > 0 && (
                                    <div className="discount-badge">-{juego.descuento}%</div>
                                )}
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
                                            <span key={plataforma} className="badge bg-secondary me-1">
                                                {plataforma}
                                            </span>
                                        ))}
                                    </div>
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
                                            <span className="old-price text-decoration-line-through me-2">
                                                S/ {(juego.precio / (1 - juego.descuento / 100)).toFixed(2)}
                                            </span>
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
                </div>
            </div>

            {juegoSeleccionado && (
                <DetalleJuego
                    juego={juegoSeleccionado}
                    show={mostrarModal}
                    onHide={cerrarModal}
                    onAddComment={agregarComentario}
                />
            )}
            <div>
                <BarraCarrito />
                <Footer/>
            </div>
        </div>
    );
}

export default MejorValorados;