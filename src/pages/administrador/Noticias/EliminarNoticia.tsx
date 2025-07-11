import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../../css/EliminarNoticia.css'; 

// Estructura Eliminar Noticia Props
interface EliminarNoticiaProps {
  noticiaId: number; 
  nombreNoticia: string; 
  onCerrar: () => void; 
  onEliminar: (id: number) => Promise<void>;
  onShowMessage: (type: 'success' | 'danger', text: string) => void; 
  show: boolean;
}

const EliminarNoticia: React.FC<EliminarNoticiaProps> = ({ noticiaId, nombreNoticia, onCerrar, onEliminar, onShowMessage, show }) => {
  const handleConfirm = async () => {
    try {
      await onEliminar(noticiaId);
    } catch (error: any) { 
      console.error("Error al eliminar noticia desde el modal:", error);
      onShowMessage('danger', `Error al eliminar noticia: ${error.message}`); 
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <p>¿Estás seguro de que quieres eliminar la noticia: <strong>"{nombreNoticia}"</strong>?</p>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EliminarNoticia;