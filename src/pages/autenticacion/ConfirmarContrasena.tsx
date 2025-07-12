// src/components/ConfirmarContrasena.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png'; // Asegúrate de que esta ruta sea correcta

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/ConfirmarContrasena.css'; // Tu archivo CSS existente

function ConfirmarContrasena() {
  const navigate = useNavigate();
  const location = useLocation();
  const [codigoManual, setCodigoManual] = useState('');
  // Mensaje inicial más neutro
  const [mensaje, setMensaje] = useState('Por favor, ingresa el código de verificación o haz clic en el enlace de tu correo.');
  const [variante, setVariante] = useState('info');
  const [verificacionAutomaticaIntentada, setVerificacionAutomaticaIntentada] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenDesdeURL = params.get('token');

    if (tokenDesdeURL && !verificacionAutomaticaIntentada) {
      console.log("Token encontrado en la URL:", tokenDesdeURL);
      manejarVerificacion(tokenDesdeURL);
      setVerificacionAutomaticaIntentada(true);
      setMensaje('Verificando tu cuenta automáticamente...'); // Mensaje mientras se procesa
      setVariante('info');
    }
    // *** AQUÍ ESTÁ EL CAMBIO CLAVE: NO HAY ELSE IF PARA EL MENSAJE INICIAL DE ERROR DE TOKEN ***
    // Si no hay token en la URL, el mensaje inicial (el del useState) se mantiene.
  }, [location.search, navigate, verificacionAutomaticaIntentada]);

  const manejarVerificacion = async (tokenAUsar: string) => {
    if (!tokenAUsar) {
      setMensaje('El código de verificación no puede estar vacío.');
      setVariante('danger');
      return;
    }

    setMensaje('Verificando tu cuenta...'); // Mensaje cuando el usuario envía manualmente
    setVariante('info');

    try {
      const response = await fetch('http://localhost:3001/api/usuarios/verificar-cuenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenAUsar }),
      });

      const data = await response.json();
      console.log("Respuesta del backend para verificación:", data);

      if (response.ok) {
        setMensaje(data.mensaje || '¡Cuenta verificada exitosamente! Serás redirigido para iniciar sesión.');
        setVariante('success');
        setTimeout(() => {
          navigate('/IniciarSesion');
        }, 3000);
      } else {
        const errorMessage = data.error || 'Error al verificar la cuenta. Por favor, intenta de nuevo.';
        setMensaje(errorMessage);
        setVariante('danger');
      }
    } catch (error) {
      console.error('Error de red o en la petición de verificación:', error);
      setMensaje('Error de conexión al servidor al verificar tu cuenta.');
      setVariante('danger');
    }
  };

  return (
    <div className="recuperar-contenedor">
      {/* Fondo animado */}
      <div className="fondo-animado"></div>

      {/* Contenido principal */}
      <div className="contenedor-principal">
        {/* Logo - ESTA PARTE NO SE CAMBIA, LA IMAGEN SIGUE AHÍ */}
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Game Verse Logo" className="logo" />
        </div>

        {/* Título */}
        <h2 className="titulo-principal">Confirme su identidad</h2>

        {/* Descripción y mensajes de estado */}
        <p className="descripcion">
          Para confirmar su registro, se envió un correo con un código de verificación. Revisa tu bandeja de entrada.
        </p>
        <p className="descripcion">
          O, si ya tienes el código, ingrésalo a continuación:
        </p>

        {/* Mensajes de Alert de Bootstrap */}
        {mensaje && <Alert variant={variante} className="mt-3">{mensaje}</Alert>}

        {/* Formulario para ingresar el código manualmente */}
        <Form onSubmit={(e) => {
            e.preventDefault();
            manejarVerificacion(codigoManual);
          }}
          className="mt-3"
        >
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Ingrese el código"
              value={codigoManual}
              onChange={(e) => setCodigoManual(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="boton-enviar">
            Validar Código
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ConfirmarContrasena;