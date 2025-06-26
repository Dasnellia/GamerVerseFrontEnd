import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/DetalleJuego.css';
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';

export interface Comentario {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Juego {
  id: number;
  nombre: string;
  precio: number;
  plataformas: string[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
  descripcionLarga: string;
  trailerURL: string;
  galeria: string[];
  caracteristicas: string[];
  categoria: string;
  comentarios: Comentario[];
  lanzamiento: string;
}

interface DetalleJuegoProps {
  juego: Juego | null;
  show: boolean;
  onHide: () => void;
  onAddComment: (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => void;
}

function DetalleJuego({ juego, show, onHide, onAddComment }: DetalleJuegoProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [usuarioRating, setUsuarioRating] = useState(5);

  if (!juego) return null;

  const handleRatingClick = (rating: number) => {
    setUsuarioRating(rating);
  };

  const handleAddComment = () => {
    if (nuevoComentario.trim() === '') return;

    onAddComment(juego.id, {
      user: 'Tú',
      rating: usuarioRating,
      text: nuevoComentario
    });

    setNuevoComentario('');
  };

  const formatoFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable contentClassName="custom-backdrop" id="detalle-juego-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">{juego.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <div className="row mt-5">
          <div className="col-md-6 d-flex flex-column">
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={juego.trailerURL}
                title={`${juego.nombre} Trailer`}
                allowFullScreen
                className="custom-iframe"
              ></iframe>
            </div>

            <div className="mt-3">
              <h6 className="custom-gallery-title">Galería</h6>
              <div className="row row-cols-4 g-2">
                {juego.galeria.map((img, index) => (
                  <div className="col" key={index}>
                    <img
                      src={img}
                      alt={`${juego.nombre} ${index + 1}`}
                      className="img-thumbnail cursor-pointer custom-image-thumbnail"
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      onClick={() => setExpandedImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal show={expandedImage !== null} onHide={() => setExpandedImage(null)} centered size="xl">
            <Modal.Header closeButton>
              <Modal.Title>{juego.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <img
                src={expandedImage || ''}
                alt="Ampliación"
                className="img-fluid"
                style={{ maxHeight: '70vh' }}
              />
            </Modal.Body>
          </Modal>

          <div className="col-md-6 d-flex flex-column">
            <h6 className="custom-description-title">Descripción</h6>
            <p className="custom-description-text">{juego.descripcionLarga}</p>

            <div className="mb-3">
              <h6 className="custom-release-date-title">Fecha de lanzamiento</h6>
              <p className="custom-release-date-text">{formatoFecha(juego.lanzamiento)}</p>
            </div>

            <div className="mb-3">
              <h6 className="custom-platforms-title">Plataformas</h6>
              <div>
                {juego.plataformas.map((plataforma) => (
                  <span key={plataforma} className="badge bg-secondary me-1">{plataforma}</span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="custom-features-title">Características</h6>
              <ul className="list-unstyled custom-features-list">
                {juego.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="custom-feature-item">{caracteristica}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="custom-genres-title">Categoría</h6>
              <span className="badge bg-info me-1">{juego.categoria}</span>
            </div>

            <div className="d-flex flex-grow-1 align-items-center justify-content-between mb-0">
              <div>
                <h6 className="mb-0 custom-price-text">Precio: <span className="text-danger">S/ {juego.precio.toFixed(2)}</span></h6>
                {juego.descuento > 0 && (
                  <small className="text-danger custom-discount-text">
                    {juego.descuento}% de descuento
                  </small>
                )}
              </div>
              <button
                className="btn btn-sm btn-primary"
                data-id={juego.id}
                data-nombre={juego.nombre}
                data-precio={juego.precio.toFixed(2)}
                data-imagen={juego.imagen}
                onClick={(e) => {
                  handleAgregarAlCarrito(e);
                  setTimeout(() => window.location.reload(), 500);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        <div id="toast" className="toast"></div>

        <div className="mt-4">
          <h5 className="custom-reviews-title">Reseñas</h5>
          {juego.comentarios?.map((comentario) => (
            <div key={comentario.id} className="card mb-2 custom-review-card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title custom-review-user">{comentario.user}</h6>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < comentario.rating ? 'bi-star-fill text-warning' : 'bi-star'} custom-review-star`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="card-text custom-review-text">{comentario.text}</p>
                <small className="text-muted custom-review-date">{comentario.date}</small>
              </div>
            </div>
          ))}

          <div className="mt-4 custom-add-review">
            <h5 className="custom-reviews-title">Añadir tu reseña</h5>
            <div className="mb-3">
              <label className="form-label text-white">Puntuación</label>
              <div>
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi ${i < usuarioRating ? 'bi-star-fill text-warning' : 'bi-star'} fs-4 me-1 custom-rating-star`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRatingClick(i + 1)}
                  ></i>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <textarea
                className="form-control custom-review-textarea"
                rows={3}
                placeholder="Escribe tu reseña..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-danger custom-submit-review-button"
              onClick={handleAddComment}
              disabled={!nuevoComentario.trim()}
            >
              Enviar reseña
            </button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <button type="button" className="btn btn-danger" onClick={onHide}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetalleJuego;
