import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../css/EditarNoticia.css';

interface DetalleNoticia {
  id: number;
  foto?: string;
  name: string;
  descripcion: string;
}

// Estructura Editar Noticia
interface EditarNoticiaProps {
  noticiaActual: DetalleNoticia | null;
  onCerrar: () => void;
  onGuardar: (datosEditados: DetalleNoticia) => void;
  show: boolean;
}

const EditarNoticia: React.FC<EditarNoticiaProps> = ({ noticiaActual, onCerrar, onGuardar, show }) => {
  const [name, setName] = useState<string>(noticiaActual?.name || '');
  const [descripcion, setDescripcion] = useState<string>(noticiaActual?.descripcion || '');
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    if (noticiaActual) {
      setName(noticiaActual.name);
      setDescripcion(noticiaActual.descripcion);
      setFoto(null);
    } else {
      setName('');
      setDescripcion('');
      setFoto(null);
    }
  }, [noticiaActual]);

  // Envia Formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noticiaActual) {
      onGuardar({
        ...noticiaActual,
        name: name,
        descripcion: descripcion,
        foto: foto ? foto.name : noticiaActual.foto
      });
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Editar Noticia</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          {noticiaActual ? (
            <>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setFoto(e.target.files[0]);
                    }
                  }}
                  className="bg-secondary text-white"
                />
                 {noticiaActual.foto && !foto && (
                   <Form.Text className="text-muted">
                     Foto actual: {noticiaActual.foto.split('/').pop()}
                   </Form.Text>
                 )}
                 {foto && (
                   <Form.Text className="text-muted">
                     Nueva foto seleccionada: {foto.name}
                   </Form.Text>
                 )}
              </Form.Group>
            </>
          ) : (
            <p>Seleccione una noticia para editar.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditarNoticia;