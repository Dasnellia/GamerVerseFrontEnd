import BarraCarrito from '../carrito/BarraCarrito'; 
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';
import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Inicio.css';

import Footer from './Footer';
import type { Juego as JuegoCompleto, Comentario } from './DetalleJuego';
import DetalleJuego from './DetalleJuego';
import { productosIniciales } from './DetalleJuego';

import Banner1 from '../../imagenes/Verano.png';
import Banner2 from '../../imagenes/Promo.png';
import Banner3 from '../../imagenes/Juego-Nuevo.png';
import BarraNav from './BarraNavUser';

const URL = "http://localhost:5000" 


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

const Inicio = () => {
  
  const [ lista, setLista ] = useState<JuegoCompleto[]>([])

  const httpsobtenerJuegos = (): JuegoBasico[] => {
    const juegosGuardados = localStorage.getItem('juegos');
    return juegosGuardados ? JSON.parse(juegosGuardados) : juegosIniciales;
  }

  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [juegosFiltrados, setJuegosFiltrados] = useState<JuegoBasico[]>(juegosIniciales);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
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

  useEffect(() => {
    filtrarJuegos();
  }, [nombreBusqueda]);

  return (
    <div id="inicio-page-container">
      <BarraNav onAbrirFiltroLateral={() => {}}/>
      <div className="container-fluid mt-4">
        <div className="row">
          
          <div className="col">
            
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