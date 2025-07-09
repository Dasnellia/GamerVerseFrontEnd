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
import { productosIniciales } from './DetalleJuego'; // Asumo que productosIniciales es la fuente de datos inicial

// Los banners estáticos ya no se importan ni se usan en el carrusel
// import Banner1 from '../../imagenes/Verano.png';
// import Banner2 from '../../imagenes/Promo.png';
// import Banner3 from '../../imagenes/Juego-Nuevo.png';
import BarraNav from './BarraNavUser';

const API_NOTICIAS_URL = 'http://localhost:3001/api/noticia'; // URL de tu API de noticias

// Interfaz para la estructura de una Noticia (debe coincidir con tu backend)
interface Noticia {
  id: number; // Corresponde a NoticiaID
  titulo: string; // Corresponde a Titulo
  descripcion: string; // Corresponde a Descripcion
  foto?: string | null; // Corresponde a Foto (URL completa o null)
}

interface JuegoBasico {
  id: number;
  nombre: string;
  precio: number;
  plataformas: string[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
  lanzamiento?: string; // Añadido para consistencia con la lógica de filtrado/ordenamiento
}

// Mapeo inicial de productosIniciales a JuegoBasico
const juegosBasicosIniciales: JuegoBasico[] = productosIniciales.map(juego => ({
  id: juego.id,
  nombre: juego.nombre,
  precio: juego.precio,
  plataformas: juego.plataformas,
  descuento: juego.descuento,
  rating: juego.rating,
  imagen: juego.imagen,
  descripcion: juego.descripcion,
  lanzamiento: juego.lanzamiento // Asegura que 'lanzamiento' se mapee
}));

const Inicio = () => {
  const [juegosData, setJuegosData] = useState<JuegoCompleto[]>(productosIniciales);
  const [noticiasCarrusel, setNoticiasCarrusel] = useState<Noticia[]>([]); // Nuevo estado para las noticias del carrusel
  const [loadingNoticias, setLoadingNoticias] = useState<boolean>(true);
  const [errorNoticias, setErrorNoticias] = useState<string | null>(null); // Se mantiene para depuración

  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [juegosFiltrados, setJuegosFiltrados] = useState<JuegoBasico[]>(juegosBasicosIniciales);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoCompleto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para cargar las noticias desde el backend
  const fetchNoticias = async () => {
    try {
      setLoadingNoticias(true);
      const response = await fetch(API_NOTICIAS_URL);
      if (!response.ok) {
        throw new Error('Error al cargar las noticias.');
      }
      const data: any[] = await response.json();
      // Mapea los datos del backend a la interfaz Noticia
      const mappedNoticias: Noticia[] = data.map(noticia => ({
        id: noticia.NoticiaID,
        titulo: noticia.Titulo,
        descripcion: noticia.Descripcion,
        // Usa la URL de la foto tal cual viene del backend
        foto: noticia.Foto || null, 
      }));
      setNoticiasCarrusel(mappedNoticias);
    } catch (error: any) {
      console.error("Error al cargar noticias para el carrusel:", error);
      setErrorNoticias(error.message); // Guarda el error
    } finally {
      setLoadingNoticias(false);
    }
  };

  // Carga las noticias cuando el componente se monta
  useEffect(() => {
    fetchNoticias();
  }, []);

  const abrirModal = (juegoId: number) => {
    const juegoCompleto = juegosData.find(p => p.id === juegoId);
    if (juegoCompleto) {
      setJuegoSeleccionado(juegoCompleto);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setJuegoSeleccionado(null);
  };

  const handleAgregarJuegoAlCarrito = (evento: React.MouseEvent<HTMLButtonElement>) => {
    const boton = evento.currentTarget;
    const id = parseInt(boton.dataset.id || '', 10);
    const nombre = boton.dataset.nombre;
    const precioString = boton.dataset.precio;
    const precio = precioString ? parseFloat(precioString) : undefined;
    const imagen = boton.dataset.imagen;

    if (id && nombre && precio !== undefined && imagen) {
        handleAgregarAlCarrito(evento);
    }
  };

  const agregarComentario = (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => {
    setJuegosData(prevJuegosData =>
      prevJuegosData.map(juego => {
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

  const parseFecha = (fecha: string): Date => {
    const [dia, mes, anio] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia); 
  };

  const filtrarJuegos = () => {
    const nombreFiltrado = nombreBusqueda.toLowerCase();

    const nuevosJuegosFiltrados = juegosData
      .filter(juego => {
        return juego.nombre.toLowerCase().includes(nombreFiltrado);
      })
      .sort((a, b) => {
        const fechaA = a.lanzamiento ? parseFecha(a.lanzamiento).getTime() : 0;
        const fechaB = b.lanzamiento ? parseFecha(b.lanzamiento).getTime() : 0;
        return fechaB - fechaA;
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
        descripcion: juego.descripcion,
        lanzamiento: juego.lanzamiento
      }));

    setJuegosFiltrados(nuevosJuegosFiltrados);
  };
  
  useEffect(() => {
    filtrarJuegos();
  }, [nombreBusqueda, juegosData]);

  return (
    <div id="inicio-page-container">
      <BarraNav onAbrirFiltroLateral={() => {}}/>
      <div className="container-fluid mt-4">
        <div className="row">
          
          <div className="col">
            
            <div className="container">
              <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner rounded">
                  {loadingNoticias ? (
                    // Muestra un mensaje de carga mientras se obtienen las noticias
                    <div className="carousel-item active">
                      <img src="https://placehold.co/1200x400/333333/ffffff?text=Cargando+Noticias..." className="d-block w-100" alt="Cargando..." />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                        <h5>Cargando Noticias...</h5>
                        <p>Por favor, espera.</p>
                      </div>
                    </div>
                  ) : noticiasCarrusel.length > 0 ? (
                    // Muestra las noticias cargadas dinámicamente si hay alguna
                    noticiasCarrusel.map((noticia, index) => (
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={noticia.id}>
                        <img 
                          src={noticia.foto || 'https://placehold.co/1200x400/777777/ffffff?text=Noticia+Sin+Foto'} 
                          className="d-block w-100" 
                          alt={noticia.titulo} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/1200x400/777777/ffffff?text=Error+Cargando+Foto';
                          }}
                        />
                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                          <h5>{noticia.titulo}</h5>
                          <p>{noticia.descripcion}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Si no hay noticias (ya sea por error o porque el backend devuelve vacío), muestra un mensaje de "no hay noticias"
                    <div className="carousel-item active">
                      <img src="https://placehold.co/1200x400/555555/ffffff?text=No+hay+noticias+disponibles" className="d-block w-100" alt="No hay noticias" />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                        <h5>No hay noticias disponibles</h5>
                        <p>Revisa más tarde.</p>
                      </div>
                    </div>
                  )}
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
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/cccccc/000000?text=No+Image'; 
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
                            onClick={handleAgregarJuegoAlCarrito}
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
