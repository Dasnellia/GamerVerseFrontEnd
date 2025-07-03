import React, { useState, useEffect } from 'react';
import NavBarra from '../BarraNavAdmin';
import EditarNoticia from './EditarNoticia';
import EliminarNoticia from './EliminarNoticia';
import AgregarNoticia from './AgregarNoticia';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/ListaNoticias.css';

// Estructura para la Tabla (DEFINICIÓN CONSISTENTE)
export interface DetalleNoticia {
  id: number; // Corresponde a NoticiaID
  foto?: string | null; // Corresponde a Foto (URL completa o null)
  titulo: string; // Corresponde a Titulo
  descripcion: string; // Corresponde a Descripcion
}

// Estructura para Agregar Noticia (DEFINICIÓN CONSISTENTE)
export interface NewNewsInput {
  titulo: string;
  descripcion: string;
  foto?: string | null; // La foto es una URL (string) o null
}

// Main Content Component
const MainContent: React.FC = () => {
  const [datosNoticias, setDatosNoticias] = useState<DetalleNoticia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [isEditarModalOpen, setIsEditarModalOpen] = useState<boolean>(false);
  const [noticiaIdAEditar, setNoticiaIdAEditar] = useState<number | null>(null);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState<boolean>(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<DetalleNoticia | null>(null);
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState<boolean>(false);

  // Nuevo estado para mensajes inline (éxito/error de acciones CRUD)
  const [inlineMessage, setInlineMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/noticia'; // URL base para los endpoints de noticias

  // Helper para obtener el token JWT del localStorage
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('adminToken'); // Asume que el token de admin se guarda aquí
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Añadir Content-Type para JSON body
      };
    }
    return {}; // Retorna un objeto vacío si no hay token, que es válido para HeadersInit
  };

  // Función para mostrar mensajes inline (se pasa a los modales)
  const showInlineMessage = (type: 'success' | 'danger', text: string) => {
    setInlineMessage({ type, text });
    // Opcional: Ocultar el mensaje después de unos segundos
    setTimeout(() => {
      setInlineMessage(null);
    }, 5000); 
  };

  // ==========================================================
  // FETCH INICIAL Y RECARGA DE NOTICIAS
  // ==========================================================
  const refreshNoticias = async () => {
    try {
      setLoading(true);
      setError(null);
      setInlineMessage(null); // Limpiar mensajes inline al recargar

      // IMPORTANTE: Envía el token para la carga inicial de noticias.
      // Si el backend requiere autenticación/autorización para GET /api/noticia,
      // y el token no es válido o el usuario no es admin, el backend debe devolver un error.
      const response = await fetch(API_BASE_URL, { headers: getAuthHeaders() }); 
      
      if (!response.ok) {
        const errorData = await response.json();
        // Si el backend devuelve un mensaje específico de error de autorización, úsalo.
        // Si no, usa un mensaje genérico.
        throw new Error(errorData.msg || 'Error al obtener las noticias.');
      }
      const data: any[] = await response.json(); // Backend devuelve NoticiaID, Titulo, Descripcion, Foto

      const mappedData: DetalleNoticia[] = data.map(noticia => ({
        id: noticia.NoticiaID,
        titulo: noticia.Titulo,
        descripcion: noticia.Descripcion,
        // Usa la URL directamente del backend o null. No se modifica la estructura de la foto.
        foto: noticia.Foto || null, 
      }));
      setDatosNoticias(mappedData);
    } catch (err: any) {
      console.error("Error al cargar/recargar noticias:", err);
      // *** MENSAJE DE ERROR IDÉNTICO AL DE LISTADOUDUARIOS.TSX ***
      setError(err.message || "No se pudo cargar la lista de noticias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNoticias();
  }, []); // Se ejecuta solo una vez al montar el componente

  // ==========================================================
  // AGREGAR NOTICIA
  // ==========================================================
  const handleAgregarClick = (): void => {
    setIsAgregarModalOpen(true);
  };

  const handleCerrarAgregarModal = (): void => {
    setIsAgregarModalOpen(false);
  };

  const handleAgregarNoticia = async (nuevaNoticiaInput: NewNewsInput): Promise<void> => {
    const headers = getAuthHeaders();
    
    const body = JSON.stringify({
      Titulo: nuevaNoticiaInput.titulo,
      Descripcion: nuevaNoticiaInput.descripcion,
      Foto: nuevaNoticiaInput.foto || null, // Envía la URL de la foto o null
    });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: headers, // Ya incluye Content-Type: application/json
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al crear la noticia.');
      }
      const data = await response.json();
      console.log("Noticia agregada con éxito:", data.noticia);
      await refreshNoticias(); // Recarga la lista de noticias desde el backend
      handleCerrarAgregarModal();
      showInlineMessage("success", "Noticia agregada con éxito."); // Usa showInlineMessage
    } catch (err: any) {
      console.error("Error al agregar noticia:", err);
      showInlineMessage("danger", err.message || "Ocurrió un error desconocido al agregar la noticia."); // Usa showInlineMessage
    }
  };

  // ==========================================================
  // EDITAR NOTICIA
  // ==========================================================
  const handleEditarClick = (id: number): void => {
    setNoticiaIdAEditar(id);
    setIsEditarModalOpen(true);
  };

  const handleCerrarEditarModal = (): void => {
    setIsEditarModalOpen(false);
    setNoticiaIdAEditar(null);
  };

  const handleGuardarCambios = async (datosEditados: DetalleNoticia): Promise<void> => {
    const headers = getAuthHeaders();

    const body = JSON.stringify({
      Titulo: datosEditados.titulo,
      Descripcion: datosEditados.descripcion,
      Foto: datosEditados.foto || null, // Envía la URL de la foto o null
    });

    try {
      const response = await fetch(`${API_BASE_URL}/${datosEditados.id}`, {
        method: 'PUT',
        headers: headers, // Ya incluye Content-Type: application/json
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al actualizar la noticia.');
      }
      const data = await response.json();
      console.log("Noticia actualizada con éxito:", data.noticia);
      await refreshNoticias();
      handleCerrarEditarModal();
      showInlineMessage("success", "Noticia actualizada con éxito."); // Usa showInlineMessage
    } catch (err: any) {
      console.error("Error al guardar cambios de noticia:", err);
      showInlineMessage("danger", err.message || "Ocurrió un error desconocido al guardar los cambios."); // Usa showInlineMessage
    }
  };

  const getNoticiaToEdit = (): DetalleNoticia | null => {
    return datosNoticias.find(noticia => noticia.id === noticiaIdAEditar) || null;
  };

  // ==========================================================
  // ELIMINAR NOTICIA
  // ==========================================================
  const handleEliminarClick = (noticia: DetalleNoticia): void => {
    setNoticiaAEliminar(noticia);
    setIsEliminarModalOpen(true);
  };

  const handleCerrarEliminarModal = (): void => {
    setIsEliminarModalOpen(false);
    setNoticiaAEliminar(null);
  };

  const confirmarEliminarNoticia = async (id: number): Promise<void> => {
    const headers = getAuthHeaders(); // Obtener cabeceras de autorización

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: headers, // Ya incluye Content-Type: application/json (aunque para DELETE sin body no es estricto)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al eliminar la noticia.');
      }
      const data = await response.json();
      console.log("Noticia eliminada con éxito:", data.msg);
      await refreshNoticias();
      handleCerrarEliminarModal();
      showInlineMessage("success", "Noticia eliminada con éxito."); // Usa showInlineMessage
    } catch (err: any) {
      console.error("Error al eliminar noticia:", err);
      showInlineMessage("danger", err.message || "Ocurrió un error desconocido al eliminar la noticia."); // Usa showInlineMessage
    }
  };

  // ==========================================================
  // Renderizado
  // ==========================================================
  if (loading) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center">
          <p>Cargando noticias...</p>
          {/* Añadir spinner como en ListadoUsuarios.tsx para coherencia */}
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // *** MENSAJE DE ERROR IDÉNTICO AL DE LISTADOUDUARIOS.TSX ***
  if (error) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center text-danger">
          <p>Error: {error}</p>
          <p>Asegúrate de que el servidor backend esté corriendo y de que el usuario tenga permisos de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-0 display-5">Noticias</h1>
          <button className="btn" onClick={handleAgregarClick}>
            <i className="bi bi-plus-circle-fill"></i> Agregar
          </button>
        </div>
        
        {/* Bloque para mostrar mensajes inline */}
        {inlineMessage && (
          <div className={`alert alert-${inlineMessage.type} alert-dismissible fade show`} role="alert">
            {inlineMessage.text}
            <button type="button" className="btn-close" onClick={() => setInlineMessage(null)} aria-label="Close"></button>
          </div>
        )}

        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <table className="news-table user-table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosNoticias.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">No hay noticias registradas.</td>
                      </tr>
                    ) : (
                      datosNoticias.map((noticia) => (
                        <tr key={noticia.id}>
                          <td>{noticia.id}</td>
                          <td>
                            <div className="user-foto">
                              {/* Muestra la foto de la noticia o un placeholder */}
                              {noticia.foto ? (
                                <img 
                                  src={noticia.foto} 
                                  alt={noticia.titulo} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  onError={(e) => { // Añadido manejador de errores
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/cccccc/000000?text=No+Foto';
                                  }}
                                />
                              ) : (
                                <img src="https://placehold.co/100x100/cccccc/000000?text=No+Foto" alt="No Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                          </td>
                          <td>{noticia.titulo}</td>
                          <td>{noticia.descripcion}</td>
                          <td className="news-actions text-center">
                            <i
                              className="bi bi-pencil-square"
                              onClick={() => handleEditarClick(noticia.id)}
                              style={{ cursor: 'pointer' }}
                            ></i>
                            <i
                              className="bi bi-trash3"
                              onClick={() => handleEliminarClick(noticia)}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: '#dc3545' }}
                            ></i>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Modales */}
                {isEditarModalOpen && noticiaIdAEditar !== null && (
                  <EditarNoticia
                    show={isEditarModalOpen}
                    onCerrar={handleCerrarEditarModal}
                    onGuardar={handleGuardarCambios}
                    noticiaActual={getNoticiaToEdit()}
                    onShowMessage={showInlineMessage} // Pasa la función de mensaje inline
                  />
                )}

                {isEliminarModalOpen && noticiaAEliminar !== null && (
                  <EliminarNoticia
                    show={isEliminarModalOpen}
                    onCerrar={handleCerrarEliminarModal}
                    noticiaId={noticiaAEliminar.id}
                    nombreNoticia={noticiaAEliminar.titulo}
                    onEliminar={confirmarEliminarNoticia}
                    onShowMessage={showInlineMessage} // Pasa la función de mensaje inline
                  />
                )}

                {isAgregarModalOpen && (
                  <AgregarNoticia
                    show={isAgregarModalOpen}
                    onCerrar={handleCerrarAgregarModal}
                    onAgregar={handleAgregarNoticia}
                    onShowMessage={showInlineMessage} // Pasa la función de mensaje inline
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListadoNoticias: React.FC = () => {
  return (
    <div className="d-flex vh-100">
      <NavBarra />
      <div className="content flex-grow-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default ListadoNoticias;
