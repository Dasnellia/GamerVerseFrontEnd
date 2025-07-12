import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Carrito.css';

import CarroVacio from '../../imagenes/CarroVacio.png'; 
import BarraNav from '../catalogo/BarraNavUser';

export interface CarritoItem {
  id: number; 
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string | null; 
  stockDisponible: number; 
}

function CarritoPage() {
  const navigate = useNavigate();
  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inlineMessage, setInlineMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/carrito'; 
  const STATIC_IMAGES_BASE_URL = 'http://localhost:3001/static/';

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('userToken'); 
    console.log('DEBUG: getAuthHeaders - Token recuperado de localStorage (userToken):', token ? 'Presente' : 'Ausente'); 
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`; 
      console.log('DEBUG: getAuthHeaders - Encabezado Authorization configurado.'); 
    } else {
      console.log('DEBUG: getAuthHeaders - No se encontró token en localStorage. Encabezado Authorization NO configurado.'); 
    }
    return headers; 
  };

  const showInlineMessage = (type: 'success' | 'danger', text: string) => {
    setInlineMessage({ type, text });
    setTimeout(() => {
      setInlineMessage(null);
    }, 5000); 
  };

  // ==========================================================
  // FETCH INICIAL Y RECARGA DEL CARRITO
  // ==========================================================
  const fetchCarritoItems = async () => {
    setLoading(true);
    setError(null);
    setInlineMessage(null); 

    const headers = getAuthHeaders();
    const authorizationHeader = (headers as Record<string, string>)['Authorization'];

    if (!authorizationHeader) { 
      console.log('DEBUG: fetchCarritoItems - No hay encabezado Authorization. Mostrando error de inicio de sesión.'); 
      setError("Debes iniciar sesión para ver tu carrito.");
      setLoading(false);
      return;
    }
    console.log('DEBUG: fetchCarritoItems - Encabezado Authorization presente. Intentando fetch del carrito.'); 

    try {
      const response = await fetch(API_BASE_URL, { headers });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
            setError("Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo.");
            localStorage.removeItem('userToken');
            console.log('DEBUG: fetchCarritoItems - Error 401, userToken removido.');
        } else {
            throw new Error(errorData.msg || 'Error al obtener los ítems del carrito.');
        }
      } else {
        const data = await response.json();
        setCarritoItems(data.items);
        console.log('DEBUG: fetchCarritoItems - Carrito cargado con éxito.');
      }
    } catch (err: any) {
      console.error("Error al cargar el carrito:", err);
      setError(err.message || "No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialToken = localStorage.getItem('userToken');
    if (initialToken) {
      console.log('DEBUG: useEffect - userToken encontrado al inicio. Iniciando fetch.');
      fetchCarritoItems();
    } else {
      console.log('DEBUG: useEffect - No se encontró userToken al inicio. Mostrando error de login.');
      setError("Debes iniciar sesión para ver tu carrito.");
      setLoading(false);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userToken') { 
        const newToken = localStorage.getItem('userToken');
        console.log('DEBUG: StorageEvent - Cambio en userToken detectado. Nuevo token:', newToken ? 'Presente' : 'Ausente');
        if (newToken) {
          fetchCarritoItems(); 
        } else {
          setCarritoItems([]);
          setError("Debes iniciar sesión para ver tu carrito.");
          setLoading(false);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  // Cálculos de subtotal y total
  const envio = 15.0;
  const subtotal = carritoItems.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);
  const total = subtotal + (carritoItems.length > 0 ? envio : 0); 

  const handleCantidadChange = async (itemId: number, newCantidad: number) => {
    const cantidadFinal = Math.max(1, newCantidad); 
    const itemToUpdate = carritoItems.find(item => item.id === itemId);

    if (!itemToUpdate || cantidadFinal === itemToUpdate.cantidad) {
      return; 
    }

    if (cantidadFinal > itemToUpdate.stockDisponible) {
      showInlineMessage('danger', `No hay suficiente stock para el juego "${itemToUpdate.nombre}". Stock disponible: ${itemToUpdate.stockDisponible}`);
      return;
    }

    const headers = getAuthHeaders();
    const body = JSON.stringify({ juegoId: itemId, cantidad: cantidadFinal });

    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al actualizar la cantidad del ítem.');
      }
      await fetchCarritoItems(); 
      showInlineMessage('success', 'Cantidad actualizada.');
    } catch (err: any) {
      console.error("Error al actualizar cantidad:", err);
      showInlineMessage('danger', err.message || 'Error al actualizar la cantidad del ítem.');
    }
  };

  const handleEliminarItem = async (itemId: number) => {
    const headers = getAuthHeaders();

    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al eliminar el ítem del carrito.');
      }
      await fetchCarritoItems(); 
      showInlineMessage('success', 'Ítem eliminado del carrito.');
    } catch (err: any) {
      console.error("Error al eliminar ítem:", err);
      showInlineMessage('danger', err.message || 'Error al eliminar el ítem del carrito.');
    }
  };

  const handleVaciarCarrito = async () => {
    const headers = getAuthHeaders();

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al vaciar el carrito.');
      }
      await fetchCarritoItems(); 
      showInlineMessage('success', 'Carrito vaciado con éxito.');
    } catch (err: any) {
      console.error("Error al vaciar carrito:", err);
      showInlineMessage('danger', err.message || 'Error al vaciar el carrito.');
    }
  };

  const handleFinalizarCompra = async () => {
    const headers = getAuthHeaders(); // Obtener encabezados con el token JWT
    const body = JSON.stringify({
      usuarioId: parseInt(localStorage.getItem('userId') || ''),
      carritoItems: carritoItems.map(item => ({
        juegoId: item.id,
        cantidad: item.cantidad,
      })),
    });
  
    try {
      const response = await fetch('http://localhost:3001/api/pago', {
        method: 'POST',
        headers,
        body,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al realizar el pago.');
      }
  
      // Si el pago se procesa correctamente, redirigir al usuario
      showInlineMessage('success', 'Pago realizado exitosamente.');
      setTimeout(() => {
        navigate('/Pago'); // Redirigir a una página de confirmación
      }, 2000);
    } catch (err: any) {
      console.error("Error al finalizar compra:", err);
      showInlineMessage('danger', err.message || 'Error al realizar el pago.');
    }
  };

  // ==========================================================
  // Renderizado Condicional
  // ==========================================================
  if (loading) {
    return (
      <div className="inicio-page">
        <BarraNav onAbrirFiltroLateral={() => {}}/>
        <div className="contenedor-principal">
          <div className="container row text-center py-5">
            <p>Cargando carrito...</p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inicio-page">
        <BarraNav onAbrirFiltroLateral={() => {}}/>
        <div className="contenedor-principal">
          <div className="container row text-center py-5">
            <div className="alert alert-danger" role="alert">
              <p>Error: {error}</p>
              {error === "Debes iniciar sesión para ver tu carrito." && (
                <p>Asegúrate de que el servidor backend esté corriendo y de que hayas iniciado sesión.</p>
              )}
               {error === "Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo." && (
                <p>Por favor, inicia sesión de nuevo para continuar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inicio-page">
      {/* Navbar */}
      <BarraNav onAbrirFiltroLateral={() => {}}/>

      {/* Contenido principal */}
      <div className="contenedor-principal">
        <div className="container row">
          {inlineMessage && (
            <div className={`alert alert-${inlineMessage.type} alert-dismissible fade show`} role="alert">
              {inlineMessage.text}
              <button type="button" className="btn-close" onClick={() => setInlineMessage(null)} aria-label="Close"></button>
            </div>
          )}

          {/* Lista del carrito */}
          <div className="col-md-7" id="contenedor-carrito">
            {carritoItems.length === 0 ? (
              <div className="contenedor-carrito-vacio">
                <div id ="carrito-vacio" className="mensaje-carrito-vacio d-flex flex-column align-items-center">
                  <img src={CarroVacio} alt="Carrito Vacío" className="icono-carrito-vacio"></img>
                  <p className="text-center mb-0">El carrito está vacío.</p>
                </div>
              </div>
            ) : (
              <div className="tabla-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Artículo</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carritoItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-info">
                            {item.imagen ? (
                              <img 
                                src={`${STATIC_IMAGES_BASE_URL}${item.imagen}`} 
                                alt={item.nombre} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/cccccc/000000?text=No+Imagen';
                                }}
                              />
                            ) : (
                              <img src="https://placehold.co/100x100/cccccc/000000?text=No+Imagen" alt="No Imagen" />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="item-details">
                            <h6 className="nombre-juego">{item.nombre}</h6>
                            <p className="text-secondary">S/ {item.precio?.toFixed(2)}</p>
                          </div>
                        </td>
                        <td>
                          <div className="input-group selector-cantidad">
                            <button className="btn btn-sm" onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}>-</button>
                            <input
                              type="number"
                              className="form-control form-control-sm cantidad"
                              value={item.cantidad}
                              min="1"
                              onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value))}
                            />
                            <button className="btn btn-sm" onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-end">S/ {((item.precio || 0) * item.cantidad).toFixed(2)}</td>
                        <td className="text-center">
                          <button className="btn btn-sm eliminar" onClick={() => handleEliminarItem(item.id)}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {carritoItems.length > 0 && (
              <div className="text-end mt-3">
                <button className="btn btn-danger d-flex align-items-center" onClick={handleVaciarCarrito}>
                  <i className="bi bi-trash3-fill me-2" style={{ fontSize: '1.2rem' }}></i>
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="col-md-4" id="resumen-pedido">
            <h4>Resumen del pedido</h4>
            <div className="resumen-linea">
              <span>Subtotal:</span>
              <span className="monto-subtotal">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="resumen-linea">
              <span>Envío:</span>
              <span className="monto-envio">
                {carritoItems.length > 0 ? `S/ ${envio.toFixed(2)}` : 'S/ 0.00'}
              </span>
            </div>
            <div className="resumen-linea total">
              <span>Total:</span>
              <span className="monto-total">
                {carritoItems.length > 0 ? `S/ ${total.toFixed(2)}` : `S/ ${subtotal.toFixed(2)}`}
              </span>
            </div>
            <button className="boton-finalizar-compra" disabled={subtotal === 0} onClick={handleFinalizarCompra}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;