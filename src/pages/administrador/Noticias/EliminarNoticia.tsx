import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../../css/EliminarNoticia.css'; 

// Estructura Eliminar Noticia Props (DEFINICIÓN CONSISTENTE)
interface EliminarNoticiaProps {
  noticiaId: number; 
  nombreNoticia: string; 
  onCerrar: () => void; 
  onEliminar: (id: number) => Promise<void>; // <-- CORRECCIÓN: onEliminar es Promise<void>
  onShowMessage: (type: 'success' | 'danger', text: string) => void; // *** AÑADIDO: Prop para mostrar mensajes ***
  show: boolean;
}

// *** AÑADIDO: 'onShowMessage' a las props desestructuradas ***
const EliminarNoticia: React.FC<EliminarNoticiaProps> = ({ noticiaId, nombreNoticia, onCerrar, onEliminar, onShowMessage, show }) => {
  const handleConfirm = async () => { // <-- CORRECCIÓN: Función asíncrona
    try {
      await onEliminar(noticiaId); // <-- CORRECCIÓN: await porque onEliminar es Promise<void>
      // El modal se cerrará automáticamente en el padre después de refreshNoticias
    } catch (error: any) { // Añadido : any para tipar el error
      console.error("Error al eliminar noticia desde el modal:", error);
      // *** MODIFICADO: Reemplazado alert() por onShowMessage() ***
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
