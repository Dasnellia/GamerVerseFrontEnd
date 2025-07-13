import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Perfil.css';
import '../../css/PagoPerfilModal.css';
import PerfilModal from './PerfilModal';

const API_KEY = "c714d16cdb8bbb442e0e755e0f033937"; // Usa tu API Key de ImgBB

function Perfil() {
  // Estados del componente
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string>(""); // Almacenar URL de la imagen
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false); // Controlar la subida de la imagen
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

  // Manejador para la imagen
  const manejarCambioImagen = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    if (archivo) {
      setImagen(archivo); // Guardamos la imagen seleccionada
    }
  };

  // Función para subir la imagen a ImgBB
  const subirImagen = async () => {
    if (!imagen) return;
  
    const formData = new FormData();
    formData.append("image", imagen);
  
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Respuesta de ImgBB:", data);
  
      if (data.success) {
        const url = data.data.url;
        setImageURL(url); // Guardamos la URL de la imagen subida
        setIsImageUploaded(true); // Marcamos como imagen subida
        console.log("Imagen subida con éxito:", url);
      } else {
        // Si la respuesta de ImgBB no es exitosa, mostramos el error
        console.error("Error al subir la imagen a ImgBB:", data.error);
        setIsImageUploaded(false); // Si no se subió, mantenemos el estado como no subido
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setIsImageUploaded(false);
    }
  };

  // Función para guardar los cambios del perfil
  const manejarGuardarCambios = async (evento: FormEvent<HTMLButtonElement>) => {
    evento.preventDefault();
    setModalVisible(true);
  
    const token     = localStorage.getItem('userToken');
    const usuarioId = parseInt(localStorage.getItem('userId') || '0');
  
    if (!token) {
      console.error('No se encontró un token válido.');
      return;
    }
  
    // Subida de la imagen
    let fotoUrl = '';
    if (imagen) {
      const formDataImagen = new FormData();
      formDataImagen.append('image', imagen);
      const respImg = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: 'POST',
        body: formDataImagen,
      });
      const dataImg = await respImg.json();
      if (dataImg.success) {
        fotoUrl = dataImg.data.url;
      } else {
        console.error('Error al subir la imagen a ImgBB:', dataImg.error);
        return; 
      }
    }
  
    // Concatenamos nombre y apellidos antes de enviarlos
    const nombreCompleto = `${nombre.trim()} ${apellidos.trim()}`.trim();
  
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: nombreCompleto,       // enviamos sólo "nombre" que es el nombre completo
          correoElectronico,
          foto: fotoUrl,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Información actualizada:', data);
  
        // Guardamos el nombre completo en el localStorage
        localStorage.setItem('userNickname', nombreCompleto);
        localStorage.setItem('userEmail', correoElectronico);
        if (fotoUrl) {
          localStorage.setItem('userPhoto', fotoUrl);
        }
  
        setModalVisible(true);
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar la información:', errorData.error);
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización de perfil:', error);
    }
  };

  const manejarCierreModal = () => {
    setModalVisible(false);
    navegar('/inicio');
  };

  // Función de Cerrar sesión
  const cerrarSesion = () => {
    // Limpiar el localStorage
    localStorage.clear();
    // Redirigir a la página de inicio de sesión
    navegar('/IniciarSesion');
  };

  // Renderizado del componente
  return (
    <div className="perfil-box container">
      <div className="row">
        <div className="col-10">
        </div>
        <div className="col-2 mb-3">
          <button className="btn btn-danger perfil-btn-save d-flex justify-content-center" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="row">
        {/* Botón de Cerrar Sesión en la parte superior derecha */}
        <div className="col-md-4">
          <h2 className="perfil-title">Edita tu perfil</h2>

          {/* Sección de imagen de perfil */}
          <div className="perfil-image-container">
            <div className="perfil-image-placeholder">
              {imageURL ? (
                <img src={imageURL} alt="Imagen de perfil" width={150} height={150} />
              ) : (
                <p>Tu imagen de perfil</p>
              )}
            </div>
          </div>
          <input
            type="file"
            id="profileImageUpload"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={manejarCambioImagen} // Llamar al manejador cuando el archivo cambie
          />
          <label
            htmlFor="profileImageUpload"
            className="perfil-change-photo-text text-center d-block"
            style={{ cursor: 'pointer' }}
            onClick={subirImagen} // Llamamos a la función para subir la imagen al hacer clic
          >
            Cambiar foto
          </label>
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
