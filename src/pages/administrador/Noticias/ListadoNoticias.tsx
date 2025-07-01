import { useState } from 'react';
import NavBarra from '../BarraNavAdmin';
import EditarNoticia from './EditarNoticia';
import EliminarNoticia from './EliminarNoticia';
import AgregarNoticia from './AgregarNoticia';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/ListaNoticias.css';

import New1 from '../../../imagenes/News/News1_Sonic.jpeg';
import New2 from '../../../imagenes/News/New2_Pokemon.jpeg';
import New3 from '../../../imagenes/News/New3_Valorant.jpg';

// Estructura para la Tabla
interface DetalleNoticia {
  id: number;
  foto?: string;
  name: string;
  descripcion: string;
}

// Estructura para Agregar Notica 
interface NewNewsInput {
  name: string;
  descripcion: string;
  foto?: File | null;
}

// Datos Simulados
export const noticiasSimuladas: DetalleNoticia[] = [
  { id: 1, name: 'Sonic Racing: Crossworlds', descripcion: 'Nuevas filtraciones están comenzando a circular sobre la beta cerrada de Sonic Racing: Crossworlds, exclusiva para usuarios de PlayStation 5...', foto: New1 },
  { id: 2, name: 'Pokémon Escarlata y Púrpura', descripcion: 'Tras ofreceros detalles de la llegada de Mew y Mewtwo, os traemos un par de capturas...', foto: New2 },
  { id: 3, name: 'Valorant: nuevas skins para sus armas', descripcion: 'Riot Games ha revelado una nueva colección de skins con temática futurista...', foto: New3 },
];

// Main
const MainContent = () => {

  // Modal - Editar
  const [isEditarModalOpen, setIsEditarModalOpen] = useState<boolean>(false);
  const [noticiaIdAEditar, setNoticiaIdAEditar] = useState<number | null>(null);

  // Modal - Eliminar
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState<boolean>(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<DetalleNoticia | null>(null);

  // Modal - Agregar
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState<boolean>(false);

  // Lista Inicial (3) - Datos Simulados
  const [datosNoticias, setDatosNoticias] = useState<DetalleNoticia[]>(noticiasSimuladas); 

  // ==========================================================
  // EDITAR NOTICIA
  // ==========================================================

  // Abrir para Editar 
  const handleEditarClick = (id: number): void => {
    setNoticiaIdAEditar(id);
    setIsEditarModalOpen(true);
  };

  // Cierra Edición
  const handleCerrarEditarModal = (): void => {
    setIsEditarModalOpen(false);
    setNoticiaIdAEditar(null);
  };

  // Guarda cambios
  const handleGuardarCambios = (datosEditados: DetalleNoticia): void => {
    const updatedDatosNoticias = datosNoticias.map(noticia =>
      noticia.id === datosEditados.id ? { ...noticia, ...datosEditados } : noticia
    );
    setDatosNoticias(updatedDatosNoticias);
    handleCerrarEditarModal();
  };

  // Que Noticia se va a Editar y tiene que buscar
  const getNoticiaToEdit = (): DetalleNoticia | null => {
    return datosNoticias.find(noticia => noticia.id === noticiaIdAEditar) || null; 
  };

  // ==========================================================
  // ELIMINAR NOTICIA
  // ==========================================================

  // Abrir para Eliminar
  const handleEliminarClick = (noticia: DetalleNoticia): void => {
    setNoticiaAEliminar(noticia);
    setIsEliminarModalOpen(true);
  };

  // Cierra para Eliminar
  const handleCerrarEliminarModal = (): void => {
    setIsEliminarModalOpen(false);
    setNoticiaAEliminar(null);
  };

  // Confirma Eliminar y actualiza info
  const confirmarEliminarNoticia = (id: number): void => {
    const updatedDatosNoticias = datosNoticias.filter(noticia => noticia.id !== id);
    setDatosNoticias(updatedDatosNoticias);
    handleCerrarEliminarModal();
  };

  // ==========================================================
  // AGREGAR NOTICIA
  // ==========================================================

  // Abrir para Agregar
  const handleAgregarClick = (): void => {
    setIsAgregarModalOpen(true);
  };

  // Cierra para Agregar
  const handleCerrarAgregarModal = (): void => {
    setIsAgregarModalOpen(false);
  };

  // Agrega noticia, genera ID, cierra
  const handleAgregarNoticia = (nuevaNoticia: NewNewsInput): void => {
    // Cálculo del ID basado en 'datosNoticias'
    const newId = datosNoticias.length > 0 ? Math.max(...datosNoticias.map(noticia => noticia.id)) + 1 : 1; 
    const newDetalleNoticia: DetalleNoticia = {
      id: newId,
      name: nuevaNoticia.name,
      descripcion: nuevaNoticia.descripcion,
      foto: nuevaNoticia.foto ? nuevaNoticia.foto.name : undefined,
    };
    setDatosNoticias([...datosNoticias, newDetalleNoticia]); 
    handleCerrarAgregarModal();
  };

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
                    {datosNoticias.map((noticia) => ( 
                      <tr key={noticia.id}>
                        <td>{noticia.id}</td>
                        <td>
                          <div className="user-foto">
                            {noticia.foto && <img src={noticia.foto} alt={noticia.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                        </td>
                        <td>{noticia.name}</td>
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
                    ))}
                  </tbody>
                </table>

                {/* Editar */}
                {isEditarModalOpen && noticiaIdAEditar !== null && (
                  <EditarNoticia
                    show={isEditarModalOpen}
                    onCerrar={handleCerrarEditarModal}
                    onGuardar={handleGuardarCambios}
                    noticiaActual={getNoticiaToEdit()}
                  />
                )}

                {/* Eliminar */}
                {isEliminarModalOpen && noticiaAEliminar !== null && (
                  <EliminarNoticia
                    show={isEliminarModalOpen}
                    onCerrar={handleCerrarEliminarModal}
                    noticiaId={noticiaAEliminar.id}
                    nombreNoticia={noticiaAEliminar.name}
                    onEliminar={confirmarEliminarNoticia}
                  />
                )}

                {/* Agregar */}
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

const ListadoNoticias = () => {
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