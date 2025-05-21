import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PagoModal from './PagoModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Pago.css';
import '../../css/PagoPerfilModal.css';

function Pago() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [cvc, setCvc] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  const navigate = useNavigate();

  const handlePagar = () => {
    console.log('Realizando pago con los datos:', { nombre, direccion, numeroTarjeta, cvc, fechaVencimiento });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigate('/inicio');
  };

  return (
    <div className="box perfil-pago-review">
      <div className="row">
        {/* Sección izquierda */}
        <div className="col-md-5 text-center d-flex flex-column justify-content-center">
          <img src="./src/imagenes/LogoPrincipal.png" alt="GameVerse" className="img-fluid logo-img mx-auto" />
          <p className="title-description mt-3 mb-1 fw-bold">Disclaimer</p>
          <p className="description px-3">
            La información proporcionada en este formulario será utilizada únicamente para procesar su pago de manera segura. 
            No almacenamos datos sensibles como el número de tarjeta, CVC ni fecha de vencimiento. 
            Al continuar, usted acepta los términos y condiciones de uso, así como nuestra política de privacidad. 
            Si tiene alguna duda, por favor contáctenos antes de realizar el pago.
          </p>
        </div>

        {/* Sección derecha */}
        <div className="col-md-7">
          <form>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="numeroTarjeta" className="form-label">Número de tarjeta</label>
              <input
                type="text"
                className="form-control"
                id="numeroTarjeta"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, ''))} // solo dígitos
                maxLength={19}
                pattern="\d{15,19}"
                title="Ingrese un número de tarjeta válido (15 a 19 dígitos)"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="cvc" className="form-label">CVC</label>
                <input
                  type="text"
                  className="form-control"
                  id="cvc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  maxLength={4}
                  pattern="\d{3,4}"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="fechaVencimiento" className="form-label">Fecha de vencimiento</label>
                <input
                  type="month"
                  className="form-control"
                  id="fechaVencimiento"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="text-end mt-3">
              <button type="button" className="btn-proceed" onClick={handlePagar}>
                Realizar pago
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      <PagoModal visible={modalVisible} onClose={handleCloseModal} />
    </div>
  );
}

export default Pago;