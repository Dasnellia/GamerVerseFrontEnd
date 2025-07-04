import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../css/AgregarNoticia.css'; 

// Estructura Noticia Nueva (DEFINICIÓN CONSISTENTE)
interface NewNewsInput {
  titulo: string;
  descripcion: string;
  foto?: string | null; // La foto es una URL (string) o null
}

// Estructura de AgregarNoticiaProps (DEFINICIÓN CONSISTENTE)
interface AgregarNoticiaProps {
  onCerrar: () => void;
  onAgregar: (nuevaNoticia: NewNewsInput) => Promise<void>; // <-- CORRECCIÓN: onAgregar es Promise<void>
  show: boolean;
}

const AgregarNoticia: React.FC<AgregarNoticiaProps> = ({ onCerrar, onAgregar, show }) => {
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null); // Estado para la URL de la foto

  // Enviar Formulario que se lleno
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAgregar({ titulo, descripcion, foto: fotoUrl }); // Pasa la URL de la foto
      setTitulo(''); // Limpia el estado
      setDescripcion('');
      setFotoUrl(null);
      // El modal se cerrará automáticamente en el padre después de refreshNoticias
    } catch (error: any) { // Añadido : any para tipar el error
      console.error("Error al agregar noticia desde el modal:", error);
      alert(`Error al agregar noticia: ${error.message}`); // Usar un modal de alerta
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Agregar Nueva Noticia</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL de la Foto</Form.Label>
            <Form.Control
              type="text"
              value={fotoUrl || ''}
              onChange={(e) => setFotoUrl(e.target.value || null)}
              className="bg-secondary text-white"
              placeholder="Ej: https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar Noticia
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AgregarNoticia;
