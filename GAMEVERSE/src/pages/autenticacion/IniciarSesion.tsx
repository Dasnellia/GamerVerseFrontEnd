import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/IniciarSesion.css';

// --- Define una interfaz para la estructura de un objeto de usuario ---
interface Usuario {
  username: string;
  email: string;
  password: string;
}

function IniciarSesion() {
  // --- Gestión de Estado ---
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navegar = useNavigate();

  // --- Lógica de Autenticación ---
  const manejarInicioSesion = () => {
    setMensajeError('');
  // --- Admin ---
    if (usuarioOEmail === 'admin' && contrasena === 'admin1') {
      navegar('/ListadoUsuarios');
      return;
    }

  // --- Intentar buscar por nombre de usuario (clave en localStorage) ---
    const usuarioAlmacenadoPorUsername = localStorage.getItem(usuarioOEmail);
    let usuarioEncontrado: Usuario | null = null;
    if (usuarioAlmacenadoPorUsername) {
      const usuarioParseado = JSON.parse(usuarioAlmacenadoPorUsername) as Usuario;
      if (usuarioParseado.password === contrasena) {
        navegar(`/Inicio?username=${usuarioParseado.username}`);
        return;
      } else {
        setMensajeError('Contraseña incorrecta.');
        return;
      }
    }

  // --- Si no se encontró por nombre de usuario, iterar y buscar por correo electrónico --
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave) {
        const valorAlmacenado = localStorage.getItem(clave);
        if (valorAlmacenado) {
          try {
            const usuario = JSON.parse(valorAlmacenado) as Usuario;
            if (usuario && typeof usuario.email === 'string' && usuario.email === usuarioOEmail) {
              usuarioEncontrado = usuario;
              if (usuario.password === contrasena) {
                navegar(`/ConfirmarContrasena?username=${usuario.username}`);
                return;
              } else {
                setMensajeError('Contraseña incorrecta.');
                return;
              }
            }
          } catch (e) {
            console.warn(`Ignorando elemento no válido en localStorage: ${clave}`, e);
          }
        }
      }
    }
    setMensajeError('Usuario no registrado.');
  };

  // --- Pulsar Enter ---
  const manejarPulsacionTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      manejarInicioSesion();
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="fondo-principal">
      <div className="container d-flex flex-column align-items-center">
        {/* Logo y título de la aplicación */}
        <div id="logo-principal" className="d-flex align-items-center mb-6">
          <img
            src={LogoPrincipal}
            className="logo-principal"
            alt="Game Verse Logo"
          />
          <h1 id="titulo-logo" className="text-white ms-3 mb-0">Game Verse</h1>
        </div>
        {/* Formulario de inicio de sesión */}
        <div id="formulario-login" className="p-4 p-md-5">
          <h2 id="titulo-principal" className="mb-4">¡Bienvenido al universo gamer!</h2>
          {/* Mensaje de error (si existe) */}
          {mensajeError && (
            <Alert variant="danger" dismissible onClose={() => setMensajeError('')}>
              {mensajeError}
            </Alert>
          )}
          {/* Campo de usuario o correo electrónico */}
          <h3 id="correo-principal">Usuario o Correo Electrónico</h3>
          <div id="grupo-usuario" className="input-group mb-3">
            <span className="input-group-text" id="icono-usuario">
              <i className="bi bi-person-circle"></i>
            </span>
            <Form.Control
              type="text"
              placeholder="Usuario o Correo Electrónico"
              aria-label="Usuario o Correo Electrónico"
              value={usuarioOEmail}
              onChange={(e) => setUsuarioOEmail(e.target.value)}
              onKeyDown={manejarPulsacionTecla} 
            />
          </div>

          {/* Campo de contraseña */}
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
              aria-label="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyDown={manejarPulsacionTecla} 
            />
          </div>

          {/* Botón de inicio de sesión */}
          <button
            id="boton-iniciar-sesion"
            className="btn btn-primary w-100"
            onClick={manejarInicioSesion}
          >
            Iniciar Sesión
          </button>

          {/* Enlace para crear una cuenta */}
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