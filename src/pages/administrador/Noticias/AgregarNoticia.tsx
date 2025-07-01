import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../css/AgregarNoticia.css'; 

// Estructura Noticia Nueva
interface NewNewsInput {
  name: string;
  descripcion: string;
  foto?: File | null;
}

// Estructura de AgregarNoticia
interface AgregarNoticiaProps {
  onCerrar: () => void;
  onAgregar: (nuevaNoticia: NewNewsInput) => void;
  show: boolean;
}

const AgregarNoticia: React.FC<AgregarNoticiaProps> = ({ onCerrar, onAgregar, show }) => {
  const [name, setName] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [foto, setFoto] = useState<File | null>(null);

  // Enviar Formulario que se lleno
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgregar({ name, descripcion, foto });
    setName('');
    setDescripcion('');
    setFoto(null);
  };

  // Cambio de archivo - File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
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
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              className="bg-secondary text-white"
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