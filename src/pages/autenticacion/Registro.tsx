import React, { useState } from 'react';
import LogoSesionCrear from '../../imagenes/LogoSesionCrear.png';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Registro.css';

function Registro() {
  // --- Gestion de Estado ---
  const [correo, setCorreo] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(''); // Este es tu 'nickname' para el backend
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [pais, setPais] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const navegar = useNavigate();

  // --- Envio de Forms ---
  const manejarEnvio = async (evento: React.FormEvent): Promise<void> => {
    evento.preventDefault();
    console.log("1. manejarEnvio: Función iniciada."); // << LOG DE DEPURACIÓN
    setError(''); // Limpiar errores anteriores
    setMensajeExito(''); // Limpiar mensajes de éxito anteriores

    // --- Validaciones Frontend ---
    if (!correo || !nombreUsuario || !contrasena || !confirmarContrasena || !pais) {
      setError('Todos los campos son obligatorios.');
      console.log("2. manejarEnvio: Validación fallida - campos obligatorios."); // << LOG DE DEPURACIÓN
      return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) { // << IMPORTANTE: Asegúrate de que tu regex sea correcta. En tu código es \S+@\S+\.\S+
      setError('Ingrese un correo electrónico válido.');
      console.log("3. manejarEnvio: Validación fallida - correo inválido."); // << LOG DE DEPURACIÓN
      return;
    }
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      console.log("4. manejarEnvio: Validación fallida - contraseña corta."); // << LOG DE DEPURACIÓN
      return;
    }
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      console.log("5. manejarEnvio: Validación fallida - contraseñas no coinciden."); // << LOG DE DEPURACIÓN
      return;
    }

    console.log("6. manejarEnvio: Todas las validaciones frontend pasaron. Preparando datos para backend."); // << LOG DE DEPURACIÓN
    try {
        // --- Datos a enviar al backend ---
        const datosParaBackend = {
            correo: correo,
            nickname: nombreUsuario, // Asegúrate de que el nombre de la propiedad coincida con lo que tu backend espera (req.body.nickname)
            contrasena: contrasena,
            confirmarContrasena: confirmarContrasena, // Pasa esto si tu middleware de backend lo valida
            pais: pais,
        };
        console.log("7. manejarEnvio: Datos a enviar:", datosParaBackend); // << LOG DE DEPURACIÓN

        // --- Realizar la petición al backend ---
        // ¡Importante: la URL debe coincidir exactamente con la ruta de tu backend!
        const response = await fetch('http://localhost:3001/api/usuarios/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosParaBackend),
        });

        console.log("8. manejarEnvio: Respuesta de fetch recibida.", response); // << LOG DE DEPURACIÓN
        const data = await response.json(); // Siempre intenta parsear la respuesta

        // --- Manejo de la respuesta del backend ---
        if (!response.ok) { // Si la respuesta NO fue 2xx (ej. 400, 500)
            const backendErrorMessage = data.errores?.join(', ') || data.error || 'Error desconocido del servidor.';
            setError(backendErrorMessage);
            console.error('9. manejarEnvio: Error del backend en el registro:', data); // << LOG DE DEPURACIÓN
        } else {
            // Si la respuesta fue 2xx (exitosa)
            setMensajeExito('¡Registro exitoso! Revisa tu correo para verificar tu cuenta. Serás redirigido en unos segundos...');
            console.log('10. manejarEnvio: Registro enviado y procesado por el backend (éxito):', data); // << LOG DE DEPURACIÓN
            
            // --- Redirección ---
            setTimeout(() => {
                navegar('/ConfirmarContrasena');
            }, 3000);
        }
    } catch (e: any) {
      // Esto captura errores de red (ej. servidor apagado) o problemas antes de recibir respuesta.
      console.error("11. manejarEnvio: Error de conexión o inesperado:", e); // << LOG DE DEPURACIÓN
      setError('Error de conexión con el servidor. Por favor, inténtalo de nuevo más tarde.');
    }
  };  

  return (
    <div className="registro-container">
      {/* Sección izquierda: Formulario de registro */}
      <div className="form-section">
        <div className="logo-header">
          <img src={LogoPrincipal} alt="Game Verse Logo" className="logo-img" />
          <h1 className="logo-title">Game Verse</h1>
        </div>

        <div className="form-wrapper">
          <Form onSubmit={manejarEnvio} className="registro-form">
            <h2 className="form-title">Regístrate en Game Verse</h2>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombreUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contrasena">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Cree una contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <Form.Text className="text-muted">
                La contraseña debe tener al menos 8 caracteres.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarContrasena">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pais">
              <Form.Label>País/Región</Form.Label>
              <Form.Select value={pais} onChange={(e) => setPais(e.target.value)}>
                <option value="" disabled>Selecciona tu país</option>
                <option value="Perú">Perú</option>
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
                <option value="Chile">Chile</option>
                <option value="México">México</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="submit-btn">
              Continuar
            </Button>
          </Form>
        </div>
      </div>

      {/* Sección derecha: Imagen de fondo y contenido adicional */}
      <div className="image-section">
        <img src={LogoSesionCrear} alt="Fondo" className="background-img" />
        <div className="image-content">
          <h2 className="image-title">Crea tu cuenta gratis</h2>
          <p className="image-subtitle">Explora tus juegos favoritos y juega sin restricciones</p>
        </div>
      </div>

      {/* Botón de regreso */}
      <Link to="/IniciarSesion" className="back-to-login-btn">
        ←
      </Link>
    </div>
  );
}

export default Registro;