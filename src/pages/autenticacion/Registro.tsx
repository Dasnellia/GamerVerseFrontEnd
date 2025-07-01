import React, { useState } from 'react';
import LogoSesionCrear from '../../imagenes/LogoSesionCrear.png';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Registro.css';

// --- Interfaz para los datos del usuario ---
interface Usuario {
  username: string;
  email: string;
  password: string;
  pais: string;
}

function Registro() {
  // --- Gestion de Estado ---
  const [correo, setCorreo] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [pais, setPais] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const navegar = useNavigate();

  // --- Envio de Forms ---
  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError('');
    setMensajeExito('');

    // --- Validaciones ---
    if (!correo || !nombreUsuario || !contrasena || !confirmarContrasena || !pais) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // --- Almacenar nuevo usuario (simulado en localStorage) ---
    const nuevoUsuario: Usuario = {
      username: nombreUsuario,
      email: correo,
      password: contrasena,
      pais: pais
    };
    localStorage.setItem(nuevoUsuario.username, JSON.stringify(nuevoUsuario));
    setMensajeExito('Registro exitoso. Serás redirigido al confirmar registro en unos segundos...');

    // --- Redirección ---
    setTimeout(() => {
      navegar('/ConfirmarContrasena');
    }, 3000);
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

            {error && <Alert variant="danger">{error}</Alert>}
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