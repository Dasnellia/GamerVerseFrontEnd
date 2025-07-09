import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import { iniciarSesion } from '../../api/usuarios'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/IniciarSesion.css';

function IniciarSesion() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navegar = useNavigate();

  const manejarInicioSesion = async () => {
    setMensajeError(''); // Limpiar mensajes de error previos

    try {
      const respuesta = await iniciarSesion({ correo: usuarioOEmail, contrasena });

      if (respuesta.error) {
        setMensajeError(respuesta.error);
      } else {
        // ¡¡¡CORRECCIÓN AQUÍ!!!
        // Ahora guardamos el token como 'userToken' para usuarios normales.
        // Si necesitas un 'adminToken' para administradores, deberías tener una lógica condicional aquí
        // para guardar diferentes tokens o usar una clave diferente.
        // Por ahora, asumimos que todos los tokens se guardan como 'userToken' para el carrito.
        localStorage.setItem('userToken', respuesta.token); // <--- CAMBIO CLAVE AQUÍ
        console.log('Inicio de sesión exitoso. Token guardado como userToken:', respuesta.token);

        const tipo = respuesta.usuario.tipo;
        if (tipo === 'admin') {
          // Opcional: Si los administradores necesitan un token diferente, podrías guardarlo aquí:
          // localStorage.setItem('adminToken', respuesta.token);
          navegar('/ListadoUsuarios'); // Navega a la página de administrador
        } else {
          navegar(`/Inicio?username=${respuesta.usuario.nickname}`); // Navega a la página de inicio para usuarios normales
        }
      }
    } catch (e) {
      console.error("Error al intentar iniciar sesión:", e); // Log más detallado del error de conexión
      setMensajeError('Error de conexión con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  const manejarPulsacionTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      manejarInicioSesion();
    }
  };

  return (
    <div className="fondo-principal">
      <div className="container d-flex flex-column align-items-center">
        <div id="logo-principal" className="d-flex align-items-center mb-6">
          <img src={LogoPrincipal} className="logo-principal" alt="Game Verse Logo" />
          <h1 id="titulo-logo" className="text-white ms-3 mb-0">Game Verse</h1>
        </div>

        <div id="formulario-login" className="p-4 p-md-5">
          <h2 id="titulo-principal" className="mb-4">¡Bienvenido al universo gamer!</h2>

          {mensajeError && (
            <Alert variant="danger" dismissible onClose={() => setMensajeError('')}>
              {mensajeError}
            </Alert>
          )}

          <h3 id="correo-principal">Usuario o Correo Electrónico</h3>
          <div id="grupo-usuario" className="input-group mb-3">
            <span className="input-group-text" id="icono-usuario">
              <i className="bi bi-person-circle"></i>
            </span>
            <Form.Control
              type="text"
              placeholder="Usuario o Correo Electrónico"
              value={usuarioOEmail}
              onChange={(e) => setUsuarioOEmail(e.target.value)}
              onKeyDown={manejarPulsacionTecla}
            />
          </div>

          <div id="fila-contraseña" className="fila">
            <div className="contrasena-titulo">
              <h4 className="mb-0">Contraseña</h4>
            </div>
            <button
              className="btn-link p-0 olvidaste-contrasena"
              onClick={() => navegar('/RecuperarContrasena')}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>

          <div id="grupo-contraseña" className="input-group mb-3">
            <span className="input-group-text" id="icono-contraseña">
              <i className="bi bi-eye-fill" onClick={() => setMostrarContrasena(!mostrarContrasena)}></i>
            </span>
            <input
              type={mostrarContrasena ? "text" : "password"}
              className="form-control"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyDown={manejarPulsacionTecla}
            />
          </div>

          <button id="boton-iniciar-sesion" className="btn btn-primary w-100" onClick={manejarInicioSesion}>
            Iniciar Sesión
          </button>

          <div id="fila-crear-cuenta" className="fila2 mt-4">
            <span className="me-2">¿Nuevo en Game Verse?</span>
            <button
              className="btn-link p-0 crear-cuenta-enlace"
              onClick={() => navegar('/Registro')}
            >
              Crea una cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IniciarSesion;
