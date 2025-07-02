import { useState, useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Catalogo.css'; // Mantenemos tu CSS para el catálogo
import 'rc-slider/assets/index.css';

import Footer from './Footer';
import DetalleJuego, { productosIniciales, type Comentario } from './DetalleJuego';
import type { Juego as JuegoCompleto } from './DetalleJuego';
import BarraCarrito from '../carrito/BarraCarrito';
import { mostrarMensajeToast, handleAgregarAlCarrito as handleAgregarAlCarritoBase } from '../carrito/DetalleCarrito';

import Filtro from '../catalogo/Filtro'

// Importar el componente Dropdown de react-bootstrap

import BarraNav from './BarraNavUser';


function Catalogo() {
    // --- Estados del Componente ---
    const [nombreBusqueda, setNombreBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState(productosIniciales);

    const maxPrecioDisponible = Math.max(...productosIniciales.map(p => p.precio));
    const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, maxPrecioDisponible]);
    const [mostrarFiltroLateral, setMostrarFiltroLateral] = useState(false);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false); // Corregido el useState aquí
    const [listaProductos, setListaProductos] = useState(productosIniciales);

    const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<string[]>([]);
    // --- Funciones de Manejo de Filtros y Búsqueda ---



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
        <div id="catalogo-page-container">

            <BarraNav onAbrirFiltroLateral={() => setMostrarFiltroLateral(v => !v)} />

            <div className="container-fluid mt-4">
                <div className="row">
                    {mostrarFiltroLateral && (
                        <Filtro onFiltrar={setProductosFiltrados} />
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