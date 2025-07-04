// src/components/IniciarSesion.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert, Button } from 'react-bootstrap';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import { iniciarSesion } from '../../api/usuarios'; // Asumo que iniciarSesion es tu API
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/IniciarSesion.css';

function IniciarSesion() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navegar = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(''); 

    try {
      const respuesta = await iniciarSesion({ correo: usuarioOEmail, contrasena });

      if (respuesta && respuesta.error) {
        setMensajeError(respuesta.error);
      } else if (respuesta && respuesta.token && respuesta.usuario) {
        // *** CAMBIO CLAVE AQUÍ: Usamos 'userToken' para TODOS los tokens ***
        localStorage.setItem('userToken', respuesta.token);
        localStorage.setItem('userNickname', respuesta.usuario.nickname);
        localStorage.setItem('userId', respuesta.usuario.id);
        localStorage.setItem('userRole', respuesta.usuario.tipo); // Guarda el rol del usuario
        localStorage.setItem('userEmail', respuesta.usuario.correo || '');
        localStorage.setItem('userPhoto', respuesta.usuario.foto || '');

        console.log('Inicio de sesión exitoso. Datos guardados en localStorage.');
        console.log('Rol del usuario:', respuesta.usuario.tipo); // Verifica que el rol se guarda correctamente

        const tipo = respuesta.usuario.tipo;
        if (tipo === 'admin') {
          navegar('/ListadoUsuarios');
        } else {
          navegar('/Inicio'); // Asumo que esta es la ruta para usuarios normales
        }
      } else {
        setMensajeError('Respuesta inesperada del servidor. Intenta de nuevo.');
      }
    } catch (e: any) {
      console.error("Error al intentar iniciar sesión:", e);
      if (e instanceof TypeError && e.message.includes('Failed to fetch')) {
        setMensajeError('Error de conexión con el servidor. Asegúrate de que el backend esté funcionando.');
      } else {
        setMensajeError(e.message || 'Error desconocido al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  const manejarPulsacionTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
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

          <Form onSubmit={handleSubmit}>
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
                required
                onKeyDown={manejarPulsacionTecla}
              />
            </div>

            <div id="fila-contraseña" className="fila">
              <div className="contrasena-titulo">
                <h4 className="mb-0">Contraseña</h4>
              </div>
              <button
                type="button"
                className="btn-link p-0 olvidaste-contrasena"
                onClick={() => navegar('/RecuperarContrasena')}
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            <div id="grupo-contraseña" className="input-group mb-3">
              <span className="input-group-text" id="icono-contraseña">
                <i
                  className={`bi ${mostrarContrasena ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
              <Form.Control
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                onKeyDown={manejarPulsacionTecla}
              />
            </div>

            <Button
              id="boton-iniciar-sesion"
              type="submit"
              className="btn btn-primary w-100"
            >
              Iniciar Sesión
            </Button>
          </Form>

          <div id="fila-crear-cuenta" className="fila2 mt-4">
            <span className="me-2">¿Nuevo en Game Verse?</span>
            <button
              type="button"
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