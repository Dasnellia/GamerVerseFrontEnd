import React, { useState } from 'react';
import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/RecuperarContrasena.css';

function RecuperarContrasena() {
  // --- GGestion de Estado ---
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [usuarioActual, setUsuarioActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [paso, setPaso] = useState<'solicitar' | 'restablecer'>('solicitar');

  // --- Navegacion ---
  const navegar = useNavigate();

  // --- Manejadores de Eventos ---
  const handleSolicitarRestablecimiento = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    if (!usuarioOEmail) {
      setError('Por favor, ingrese su nombre de usuario o correo electrónico.');
      return;
    }

    const usuarioGuardado = localStorage.getItem(usuarioOEmail);
    if (!usuarioGuardado) {
      setError('No se encontró ningún usuario con ese nombre de usuario o correo electrónico.');
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    setUsuarioActual(usuarioOEmail);
    setMensaje(`Se ha enviado un enlace de verificación a su correo electrónico: ${usuario.email}. Por favor, revise su bandeja de entrada para continuar con el restablecimiento.`);
    setPaso('restablecer');
  };

  // --- Manejo de Restablecimiento ---
  const handleRestablecerContrasena = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    if (!nuevaContrasena || !confirmarNuevaContrasena) {
      setError('Por favor, ingrese y confirme su nueva contraseña.');
      return;
    }

    if (nuevaContrasena.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (nuevaContrasena !== confirmarNuevaContrasena) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    const usuarioGuardado = localStorage.getItem(usuarioActual);
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const usuarioActualizado = { ...usuario, password: nuevaContrasena };
      localStorage.setItem(usuarioActual, JSON.stringify(usuarioActualizado));
      setMensaje('Su contraseña ha sido restablecida exitosamente. Será redirigido al inicio de sesión en unos segundos...');
      setTimeout(() => {
        navegar('/IniciarSesion');
      }, 3000);
    } else {
      setError('Ocurrió un error al restablecer la contraseña. Intente nuevamente.');
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="recuperar-contenedor">
      {/* Fondo animado */}
      <div className="fondo-animado"></div>

      {/* Contenido principal del formulario */}
      <div className="contenedor-principal">
        {/* Logo de la aplicación */}
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Logo de Recuperación de Contraseña" className="logo" />
        </div>

        {/* Título de la sección */}
        <h2 className="titulo-principal">Restablecer su contraseña</h2>

        {/* Mensajes de error o éxito */}
        {error && <Alert variant="danger">{error}</Alert>}
        {mensaje && <Alert variant="info">{mensaje}</Alert>}

        {/* Paso 1: Solicitar nombre de usuario/correo electrónico */}
        {paso === 'solicitar' && (
          <>
            <p className="descripcion">
              Ingrese su nombre de usuario o correo electrónico para iniciar el proceso de restablecimiento.
            </p>
            <Form onSubmit={handleSolicitarRestablecimiento} id="formulario-solicitud">
              <Form.Group className="mb-3" controlId="usuarioOEmail">
                <Form.Control
                  type="text"
                  placeholder="Nombre de usuario o Correo electrónico"
                  value={usuarioOEmail}
                  onChange={(e) => setUsuarioOEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button className="boton-enviar" type="submit">
                Enviar
              </Button>
            </Form>
          </>
        )}

        {/* Paso 2: Ingresar nueva contraseña */}
        {paso === 'restablecer' && (
          <>
            <p className="descripcion">
              Ingrese su nueva contraseña y confírmela.
            </p>
            <Form onSubmit={handleRestablecerContrasena} id="formulario-restablecer">
              <Form.Group className="mb-3" controlId="nuevaContrasena">
                <Form.Control
                  type="password"
                  className="form-control"
                  placeholder="Nueva contraseña"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  required
                  minLength={8}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmarNuevaContrasena">
                <Form.Control
                  type="password"
                  className="form-control"
                  placeholder="Confirmar contraseña"
                  value={confirmarNuevaContrasena}
                  onChange={(e) => setConfirmarNuevaContrasena(e.target.value)}
                  required
                  minLength={8}
                />
              </Form.Group>
              <Button className="boton-enviar" type="submit">
                Restablecer contraseña
              </Button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

export default RecuperarContrasena;