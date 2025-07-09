import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Eliminamos la importación de 'imagenes' de DetalleCarrito, ya que las imágenes vendrán del backend.
// import { imagenes } from '../carrito/DetalleCarrito'; 
import '../../css/BarraCarrito.css';

// ==========================================================
// INTERFACES (DEFINIDAS AQUÍ PARA CLARIDAD O IMPORTAR DE UN ARCHIVO CENTRAL)
// Asegúrate de que esta interfaz coincida con la estructura que devuelve tu backend para los ítems del carrito.
// El backend de carritoService devuelve: id, nombre, precio, cantidad, imagen, stockDisponible
// ==========================================================
export interface CarritoItem {
  id: number; // ID del juego
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string | null; // Nombre del archivo de imagen (ej. "juego1.jpg")
  stockDisponible: number; // Stock actual del juego
}

const BarraCarrito = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/carrito'; // URL base para los endpoints del carrito
  const STATIC_IMAGES_BASE_URL = 'http://localhost:3001/static/'; // URL base para imágenes estáticas del backend

  // Helper para obtener el token JWT del localStorage
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('userToken'); // Asume que el token del usuario se guarda aquí
    // Si usas 'adminToken' para usuarios logueados en general, cámbialo aquí:
    // const token = localStorage.getItem('adminToken'); 
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // ==========================================================
  // FETCH INICIAL Y RECARGA DEL CARRITO
  // ==========================================================
  const fetchCarritoItems = async () => {
    setLoading(true);
    setError(null);

    const headers = getAuthHeaders();
    // Si no hay token, no intentamos cargar el carrito (o mostramos un mensaje de error)
    if (!(headers as Record<string, string>)['Authorization']) {
      setCarritoItems([]); // Vaciar carrito si no hay autenticación
      setError("Inicia sesión para ver tu carrito.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, { headers });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener los ítems del carrito.');
      }
      const data = await response.json();
      setCarritoItems(data.items);
    } catch (err: any) {
      console.error("Error al cargar el carrito en BarraCarrito:", err);
      setError(err.message || "No se pudo cargar el carrito.");
      setCarritoItems([]); // Vaciar carrito en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarritoItems();

    // Listener para cambios en localStorage (útil si otras pestañas/componentes modifican el carrito)
    const handleStorageChange = (e: StorageEvent) => {
      // Re-fetch el carrito si el token del usuario cambia (ej. login/logout)
      if (e.key === 'userToken' || e.key === 'adminToken') {
        fetchCarritoItems();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const mostrarCarrito = () => {
    setIsVisible(!isVisible);
  };

  const cerrarCarrito = () => {
    setIsVisible(false);
  };

  const itemsMostrados = carritoItems.slice(0, 7);

  // Cantidad de juegos que no estan siendo mostrados
  const cantidadItemsRestantes = carritoItems.length - itemsMostrados.length;

  // ==========================================================
  // ELIMINAR ÍTEM DEL CARRITO (AHORA CON FETCH)
  // ==========================================================
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
      await fetchCarritoItems(); // Recargar el carrito para reflejar el cambio
    } catch (err: any) {
      console.error("Error al eliminar ítem desde BarraCarrito:", err);
      // Aquí podrías añadir un mensaje inline si lo deseas, pero para una barra pequeña,
      // quizás solo un log en consola sea suficiente o se maneje en la página principal del carrito.
    }
  };

  return (
    <div className="barra-carrito-container">
      <button className="barra-carrito-toggle-btn fixed-bottom-left" onClick={mostrarCarrito}>
        <i className="bi bi-cart3"></i>
      </button>

      <div className={`barra-carrito-slide ${isVisible ? 'visible' : ''}`}>
        <div className="carrito-contenido">
          {loading ? (
            <p className="carrito-vacio-mensaje">Cargando...</p>
          ) : error ? (
            <p className="carrito-vacio-mensaje text-danger">{error}</p>
          ) : carritoItems.length === 0 ? (
            <p className="carrito-vacio-mensaje">El carrito está vacío.</p>
          ) : (
            <ul>
              {itemsMostrados.map(item => (
                <li key={item.id} className="carrito-item">
                  <div className="item-visual">
                    {/* Muestra la imagen construyendo la URL desde el backend estático */}
                    {item.imagen ? (
                      <img
                        src={`${STATIC_IMAGES_BASE_URL}${item.imagen}`}
                        alt={item.nombre}
                        className="item-imagen"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/60x60/cccccc/000000?text=No+Img';
                        }}
                      />
                    ) : (
                      <img src="https://placehold.co/60x60/cccccc/000000?text=No+Img" alt="No Imagen" className="item-imagen" />
                    )}
                    {/* Eliminar Juego */}
                    <button onClick={() => handleEliminarItem(item.id)} className="eliminar-item-btn">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  {/* Nombre Juego */}
                  <span className="item-nombre">{item.nombre}</span>
                </li>
              ))}
              {/* Te lleva a Carrito */}
              {cantidadItemsRestantes > 0 && (
                <li className="carrito-item more-items">
                  <Link to="/carrito" className="more-items-link">
                    +{cantidadItemsRestantes}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        {/* Hacia Carrito */}
        <div className="carrito-actions">
          <Link to="/carrito" className="ir-a-carrito-btn">
            Ver Carrito Completo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BarraCarrito;
    