import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png'
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/ConfirmarContrasena.css';

function ConfirmarContrasena() {
  const navigate = useNavigate();
  return (
    <div className="recuperar-contenedor">
      {/* Fondo animado */}
      <div className="fondo-animado"></div>
      
      {/* Contenido principal */}
      <div className="contenedor-principal">
        {/* Logo */}
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Game Verse Logo" className="logo" />
        </div>

        {/* Título */}
        <h2 className="titulo-principal">Confirme su identidad</h2>
        
        {/* Descripción */}
        <p className="descripcion">
          Para confirmar su registro, se envio un correo con un código de verificación revise su bandeja de entrada.
        </p>

        <p className="descripcion">
          Ingrese el código de verificación:
        </p>

        {/* Formulario */}
        <form id="div5">
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Ingrese el código"
              required
            />
          </div>
        </form>
        
        {/* Botón */}
        <button className="boton-enviar"
          onClick={() => navigate('/IniciarSesion')}>
          Validar Código
        </button>
      </div>
    </div>
  );

}

export default ConfirmarContrasena;