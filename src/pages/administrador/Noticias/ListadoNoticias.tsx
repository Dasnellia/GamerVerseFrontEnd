import React, { useState, useEffect } from 'react';
import NavBarra from '../BarraNavAdmin';
import EditarNoticia from './EditarNoticia';
import EliminarNoticia from './EliminarNoticia';
import AgregarNoticia from './AgregarNoticia';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/ListaNoticias.css';

// Estructura para la Tabla (DEFINICIÓN CONSISTENTE)
interface DetalleNoticia {
  id: number; // Corresponde a NoticiaID
  foto?: string | null; // Corresponde a Foto (URL completa o null)
  titulo: string; // Corresponde a Titulo
  descripcion: string; // Corresponde a Descripcion
}

// Estructura para Agregar Noticia (DEFINICIÓN CONSISTENTE)
interface NewNewsInput {
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

  // ==========================================================
  // FETCH INICIAL Y RECARGA DE NOTICIAS
  // ==========================================================
  const refreshNoticias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL); // Esta ruta es pública
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener las noticias.');
      }
      const data: any[] = await response.json(); // Backend devuelve NoticiaID, Titulo, Descripcion, Foto

      const mappedData: DetalleNoticia[] = data.map(noticia => ({
        id: noticia.NoticiaID,
        titulo: noticia.Titulo,
        descripcion: noticia.Descripcion,
        foto: noticia.Foto || null, // Usa la URL directamente del backend
      }));
      setDatosNoticias(mappedData);
    } catch (err: any) {
      console.error("Error al cargar/recargar noticias:", err);
      setError(err.message || "No se pudieron cargar las noticias.");
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
        headers: headers,
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
    } catch (err: any) {
      console.error("Error al agregar noticia:", err);
      alert(`Error al agregar noticia: ${err.message}`); // Usar un modal de alerta
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
        headers: headers,
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
    } catch (err: any) {
      console.error("Error al guardar cambios de noticia:", err);
      alert(`Error al guardar cambios: ${err.message}`); // Usar un modal de alerta
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
    const headers = getAuthHeaders();

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al eliminar la noticia.');
      }
      const data = await response.json();
      console.log("Noticia eliminada con éxito:", data.msg);
      await refreshNoticias();
      handleCerrarEliminarModal();
    } catch (err: any) {
      console.error("Error al eliminar noticia:", err);
      alert(`Error al eliminar noticia: ${err.message}`); // Usar un modal de alerta
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center text-danger">
          <p>Error: {error}</p>
          <p>Asegúrate de que el servidor backend esté corriendo y de que tengas permisos si la ruta lo requiere.</p>
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
                              {/* Usa la URL de la foto directamente del backend */}
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
                  />
                )}

                {isEliminarModalOpen && noticiaAEliminar !== null && (
                  <EliminarNoticia
                    show={isEliminarModalOpen}
                    onCerrar={handleCerrarEliminarModal}
                    noticiaId={noticiaAEliminar.id}
                    nombreNoticia={noticiaAEliminar.titulo}
                    onEliminar={confirmarEliminarNoticia}
                  />
                )}

                {isAgregarModalOpen && (
                  <AgregarNoticia
                    show={isAgregarModalOpen}
                    onCerrar={handleCerrarAgregarModal}
                    onAgregar={handleAgregarNoticia}
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
