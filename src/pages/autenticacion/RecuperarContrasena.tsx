// src/components/RecuperarContrasena.tsx
import React, { useState } from 'react';
import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/RecuperarContrasena.css';
import axios from 'axios'; // Importa Axios para hacer peticiones HTTP

function RecuperarContrasena() {
  // --- Gestión de Estado ---
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  // El paso inicial dependerá si ya tenemos un token en la URL para restablecer directamente
  const [paso, setPaso] = useState<'solicitar' | 'restablecer'>('solicitar');
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null); // Para capturar el token de la URL

  // --- Navegacion ---
  const navegar = useNavigate();

  // --- Efecto para capturar el token de la URL (si existe) ---
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setTokenFromUrl(token);
      setPaso('restablecer'); // Si hay token, vamos directo al paso de restablecer
      setMensaje('Ingrese su nueva contraseña. El enlace ha sido reconocido.');
    }
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar

  // --- Manejador para Solicitar Restablecimiento ---
  const handleSolicitarRestablecimiento = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    if (!usuarioOEmail) {
      setError('Por favor, ingrese su nombre de usuario o correo electrónico.');
      return;
    }

    try {
      // Hacemos una petición POST a tu backend para solicitar el restablecimiento
      const response = await axios.post('http://localhost:3001/api/usuarios/olvide-contrasena', {
        identifier: usuarioOEmail, // Envía el identificador (correo o nickname)
      });
      // El mensaje se establece desde la respuesta del backend (que debería ser el mensaje genérico)
      setMensaje(response.data.msg || 'Si el usuario existe, se ha enviado un enlace a su correo.');
      // IMPORTANTE: Aquí NO cambiamos el paso. El usuario debe revisar su correo y hacer clic en el enlace.
    } catch (err: any) {
      console.error('Error al solicitar restablecimiento:', err);
      // El backend ya envía un mensaje genérico por seguridad, así que replicamos eso o un mensaje de error genérico.
      setError(err.response?.data?.msg || 'Ocurrió un error al solicitar el restablecimiento. Intente nuevamente.');
    }
  };

  // --- Manejador para Restablecer Contraseña ---
  const handleRestablecerContrasena = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    if (!nuevaContrasena || !confirmarNuevaContrasena) {
      setError('Por favor, ingrese y confirme su nueva contraseña.');
      return;
    }

    if (nuevaContrasena !== confirmarNuevaContrasena) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    // La validación de longitud y complejidad se hace en el backend (middleware)
    // Sin embargo, una validación básica en el frontend es buena práctica para UX.
    if (nuevaContrasena.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!tokenFromUrl) {
        setError('No se encontró el token de restablecimiento. Por favor, solicite un nuevo enlace.');
        return;
    }

    try {
      // Hacemos una petición POST a tu backend para restablecer la contraseña
      const response = await axios.post('http://localhost:3001/api/usuarios/restablecer-contrasena', {
        token: tokenFromUrl, // Envía el token de la URL
        newPassword: nuevaContrasena,
      });

      setMensaje(response.data.msg || 'Contraseña restablecida exitosamente.');
      // Redirigir al inicio de sesión después de un breve retraso
      setTimeout(() => {
        navegar('/IniciarSesion');
      }, 3000);

    } catch (err: any) {
      console.error('Error al restablecer contraseña:', err);
      // El backend enviará mensajes de error específicos (ej. token inválido/expirado, validación de contraseña)
      setError(err.response?.data?.msg || 'Ocurrió un error al restablecer la contraseña. Intente nuevamente.');
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="recuperar-contenedor">
      <div className="fondo-animado"></div>
      <div className="contenedor-principal">
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Logo de Recuperación de Contraseña" className="logo" />
        </div>
        <h2 className="titulo-principal">Restablecer su contraseña</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {mensaje && <Alert variant="info">{mensaje}</Alert>}

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

        {paso === 'restablecer' && (
          <>
            <p className="descripcion">
              {tokenFromUrl ? 'Ingrese su nueva contraseña y confírmela.' : 'El enlace de restablecimiento ha sido enviado a su correo. Revise su bandeja de entrada.'}
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
                  minLength={8} // HTML5 validation, backend has stricter validation
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
                  minLength={8} // HTML5 validation, backend has stricter validation
                />
              </Form.Group>
              <Button className="boton-enviar" type="submit" disabled={!tokenFromUrl}>
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