import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Perfil.css';
import '../../css/PagoPerfilModal.css';
import PerfilModal from './PerfilModal';

function Perfil() {
  // Estados del componente
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [usuarioId, setUsuarioId] = useState(1); //por ahora usuario id = 1
  
  const navegar = useNavigate();

  // Manejadores de eventos
  const manejarCambio = (evento: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evento.target;
    switch (id) {
      case 'nombre':
        setNombre(value);
        break;
      case 'apellidos':
        setApellidos(value);
        break;
      case 'correoElectronico':
        setCorreoElectronico(value);
        break;
      default:
        break;
    }
  };

  // Función para enviar la solicitud de actualización del perfil
  const manejarGuardarCambios = async (evento: FormEvent<HTMLButtonElement>) => {
    evento.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          correoElectronico,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setModalVisible(true); // Mostrar modal de éxito
      } else {
        console.error('Error al editar la información del usuario:', data.error);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de actualización:', error);
    }
  };

  const manejarCierreModal = () => {
    setModalVisible(false);
    navegar('/inicio'); // Redirige a la página de inicio después de guardar los cambios
  };

  // Renderizado del componente
  return (
    <div className="perfil-box container">
      <div className="row">
        <div className="col-md-4">
          <h2 className="perfil-title">Edita tu perfil</h2>

          {/* Sección de imagen de perfil */}
          <div className="perfil-image-container">
            <div className="perfil-image-placeholder">Tu imagen de perfil</div>
            <input type="file" id="profileImageUpload" style={{ display: 'none' }} accept="image/*" />
          </div>
          <div className="perfil-change-photo-text">Cambiar foto</div>
        </div>

        <div className="col-md-8">
          {/* Sección de formulario */}
          <form>
            <div className="mb-3">
              <label htmlFor="nombre" className="perfil-form-label">Nombre</label>
              <input
                type="text"
                className="perfil-form-control"
                id="nombre"
                value={nombre}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="apellidos" className="perfil-form-label">Apellidos</label>
              <input
                type="text"
                className="perfil-form-control"
                id="apellidos"
                value={apellidos}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="correoElectronico" className="perfil-form-label">Correo electrónico</label>
              <input
                type="email"
                className="perfil-form-control"
                id="correoElectronico"
                value={correoElectronico}
                onChange={manejarCambio}
                required
              />
            </div>

            <button type="submit" className="perfil-btn-save" onClick={manejarGuardarCambios}>
              Guardar cambios
            </button>
          </form>
        </div>

        {/* Sección del modal de confirmación */}
        <PerfilModal visible={modalVisible} onClose={manejarCierreModal} />
      </div>
    </div>
  );
}

export default Perfil;
