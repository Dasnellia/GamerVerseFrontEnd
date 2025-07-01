import { useState, useEffect } from 'react';
import '../../css/BarraCarrito.css';
import { Link } from 'react-router-dom';
import type { CarritoItem } from '../carrito/DetalleCarrito';
import { imagenes } from '../carrito/DetalleCarrito';

const BarraCarrito = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [carritoItems, setCarritoItems] = useState<CarritoItem[]>(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    // Cambios en localStorage
    useEffect(() => {
        const handleStorageChange  = () => { 
            const carritoGuardado = localStorage.getItem('carrito');
            setCarritoItems(carritoGuardado ? JSON.parse(carritoGuardado) : []);
        };

        window.addEventListener('storage', handleStorageChange ); 

        return () => {
            window.removeEventListener('storage', handleStorageChange ); 
        };
    }, []);

    const mostrarCarrito = () => {  
        setIsVisible(!isVisible);
    };

    const cerrarCarrito = () => {
        setIsVisible(false);
    };

    const itemsMostrados = carritoItems.slice(0, 7); 

    // Cuanto Juegos no estan siendo mostrados
    const cantidadItemsRestantes = carritoItems.length - itemsMostrados.length; 

    // Elimina un juego del carrito
    const handleEliminarItem = (id: number) => {
        const nuevoCarrito = carritoItems.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        setCarritoItems(nuevoCarrito);
    };

    return (
        <div className="barra-carrito-container">
            <button className="barra-carrito-toggle-btn fixed-bottom-left" onClick={mostrarCarrito}> 
                <i className="bi bi-cart3"></i>
            </button>

            <div className={`barra-carrito-slide ${isVisible ? 'visible' : ''}`}>
                <div className="carrito-contenido">
                    {carritoItems.length === 0 ? (
                        <p className="carrito-vacio-mensaje">El carrito está vacío.</p>
                    ) : (
                        <ul>
                            {itemsMostrados.map(item => ( 
                                <li key={item.id} className="carrito-item">
                                    <div className="item-visual">
                                        {/* Aqui Imagen */}
                                        {item.imagen && (item.nombre in imagenes) && (
                                            <img
                                                src={imagenes[item.nombre as keyof typeof imagenes]}
                                                alt={item.nombre}
                                                className="item-imagen"
                                            />
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
