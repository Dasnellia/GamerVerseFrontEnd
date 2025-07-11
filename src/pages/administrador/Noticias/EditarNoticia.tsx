import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../css/EditarNoticia.css';

interface DetalleNoticia {
  id: number;
  foto?: string | null; 
  titulo: string;
  descripcion: string;
}

// Estructura Editar Noticia Props
interface EditarNoticiaProps {
  noticiaActual: DetalleNoticia | null;
  onCerrar: () => void;
  onGuardar: (datosEditados: DetalleNoticia) => Promise<void>;
  onShowMessage: (type: 'success' | 'danger', text: string) => void;
  show: boolean;
}

const EditarNoticia: React.FC<EditarNoticiaProps> = ({ noticiaActual, onCerrar, onGuardar, onShowMessage, show }) => {
  const [titulo, setTitulo] = useState<string>(noticiaActual?.titulo || '');
  const [descripcion, setDescripcion] = useState<string>(noticiaActual?.descripcion || '');
  const [fotoUrl, setFotoUrl] = useState<string | null>(noticiaActual?.foto ?? null); 

  useEffect(() => {
    if (noticiaActual) {
      setTitulo(noticiaActual.titulo);
      setDescripcion(noticiaActual.descripcion);
      setFotoUrl(noticiaActual.foto ?? null); 
    } else {
      setTitulo(''); 
      setDescripcion('');
      setFotoUrl(null);
    }
  }, [noticiaActual]);

  // Envia Formulario
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (noticiaActual) {
      try {
        await onGuardar({ 
          ...noticiaActual,
          titulo: titulo,
          descripcion: descripcion,
          foto: fotoUrl 
        });
      } catch (error: any) { 
        console.error("Error al guardar cambios de noticia desde el modal:", error);
        onShowMessage('danger', `Error al guardar cambios: ${error.message}`); 
      }
    }
  };

  // Función para establecer fotoUrl a null cuando se quiere eliminar la foto existente
  const handleEliminarFotoActual = () => {
    setFotoUrl(null); 
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
                {noticiaActual.foto && fotoUrl !== null && ( 
                  <Form.Text className="text-muted">
                    Foto actual: <a href={noticiaActual.foto} target="_blank" rel="noopener noreferrer">{noticiaActual.foto.split('/').pop()}</a>
                  </Form.Text>
                )}
                {noticiaActual.foto && fotoUrl !== null && ( 
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="mt-2" 
                    onClick={handleEliminarFotoActual}
                  >
                    Eliminar foto actual
                  </Button>
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