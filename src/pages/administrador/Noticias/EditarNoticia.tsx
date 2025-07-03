import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../css/EditarNoticia.css';

// Estructura DetalleNoticia (DEFINICIÓN LOCAL Y CONSISTENTE)
// Debe ser idéntica a la de ListadoNoticias.tsx
interface DetalleNoticia {
  id: number;
  foto?: string | null; // <-- CORRECCIÓN: Permite string, null o undefined
  titulo: string;
  descripcion: string;
}

// Estructura Editar Noticia Props (DEFINICIÓN LOCAL Y CONSISTENTE)
interface EditarNoticiaProps {
  noticiaActual: DetalleNoticia | null;
  onCerrar: () => void;
  onGuardar: (datosEditados: DetalleNoticia) => Promise<void>; // <-- CORRECCIÓN: onGuardar devuelve Promise<void>
  onShowMessage: (type: 'success' | 'danger', text: string) => void; // *** AÑADIDO: Prop para mostrar mensajes ***
  show: boolean;
}

// *** AÑADIDO: 'onShowMessage' a las props desestructuradas ***
const EditarNoticia: React.FC<EditarNoticiaProps> = ({ noticiaActual, onCerrar, onGuardar, onShowMessage, show }) => {
  // CORRECCIÓN: Cambiado 'setName' a 'setTitulo' para consistencia
  const [titulo, setTitulo] = useState<string>(noticiaActual?.titulo || '');
  const [descripcion, setDescripcion] = useState<string>(noticiaActual?.descripcion || '');
  // CORRECCIÓN: Estado para la URL de la foto, permite string o null
  const [fotoUrl, setFotoUrl] = useState<string | null>(noticiaActual?.foto ?? null); 

  useEffect(() => {
    if (noticiaActual) {
      setTitulo(noticiaActual.titulo); // CORRECCIÓN: Usar setTitulo
      setDescripcion(noticiaActual.descripcion);
      setFotoUrl(noticiaActual.foto ?? null); // Sincroniza la URL de la foto, usando null para undefined
    } else {
      setTitulo(''); // CORRECCIÓN: Usar setTitulo
      setDescripcion('');
      setFotoUrl(null);
    }
  }, [noticiaActual]);

  // Envia Formulario
  const handleSubmit = async (e: React.FormEvent) => { // <-- CORRECCIÓN: Función asíncrona
    e.preventDefault();
    if (noticiaActual) {
      try {
        await onGuardar({ // <-- CORRECCIÓN: await porque onGuardar es Promise<void>
          ...noticiaActual,
          titulo: titulo,
          descripcion: descripcion,
          foto: fotoUrl // <-- CORRECCIÓN: Pasa la URL de la foto (string o null)
        });
        // El modal se cerrará automáticamente en el padre después de refreshNoticias
      } catch (error: any) { // Añadido : any para tipar el error
        console.error("Error al guardar cambios de noticia desde el modal:", error);
        // *** MODIFICADO: Reemplazado alert() por onShowMessage() ***
        onShowMessage('danger', `Error al guardar cambios: ${error.message}`); 
      }
    }
  };

  // Función para establecer fotoUrl a null cuando se quiere eliminar la foto existente
  const handleEliminarFotoActual = () => {
    setFotoUrl(null); // Esto indicará al padre que la foto debe ser eliminada en el backend
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
                <Form.Label>Título</Form.Label> {/* CORRECCIÓN: Cambiado a Título */}
                <Form.Control
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)} // CORRECCIÓN: Usar setTitulo
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
                <Form.Label>URL de la Foto</Form.Label> {/* CORRECCIÓN: Cambiado a URL de la Foto */}
                <Form.Control
                  type="text" // <-- CORRECCIÓN: Tipo de input es 'text' para URL
                  value={fotoUrl || ''} // Muestra la URL actual o una cadena vacía
                  onChange={(e) => setFotoUrl(e.target.value || null)} // Guarda la URL o null si está vacío
                  className="bg-secondary text-white"
                  placeholder="Ej: https://ejemplo.com/imagen.jpg"
                />
                {noticiaActual.foto && fotoUrl !== null && ( // Muestra la URL actual si existe y no se ha marcado para borrar
                  <Form.Text className="text-muted">
                    Foto actual: <a href={noticiaActual.foto} target="_blank" rel="noopener noreferrer">{noticiaActual.foto.split('/').pop()}</a>
                  </Form.Text>
                )}
                {/* Botón para eliminar la foto actual (establece la URL a null) */}
                {noticiaActual.foto && fotoUrl !== null && ( // Solo muestra si hay foto actual y no se ha marcado para eliminar
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
