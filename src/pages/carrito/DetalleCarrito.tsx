import React from 'react';

// ==========================================================
// INTERFACES (DEFINIDAS AQUÍ COMO FUENTE ÚNICA DE VERDAD)
// Asegúrate de que esta interfaz coincida con la estructura que devuelve tu backend para los ítems del carrito.
// El backend de carritoService devuelve: id, nombre, precio, cantidad, imagen, stockDisponible
// ==========================================================
export interface CarritoItem {
  id: number; // ID del juego
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string | null; // Nombre del archivo de imagen (ej. "juego1.jpg")
  stockDisponible?: number; // Stock actual del juego (opcional aquí si no siempre se necesita)
}

// ==========================================================
// FUNCIONES DE UTILIDAD PARA EL CARRITO
// ==========================================================

// Función para mostrar mensajes "toast" (pop-up)
export const mostrarMensajeToast = (mensaje: string) => {
    const toastElement = document.getElementById('toast');
    if (toastElement) {
        toastElement.textContent = mensaje;
        toastElement.classList.add('show');
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 3000);
    }
};

// Función para agregar un juego al carrito (ahora interactúa con el backend)
// Se mantiene la firma para ser compatible con los botones existentes en Catalogo.tsx e Inicio.tsx
export const handleAgregarAlCarrito = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const boton = event.currentTarget;
    const id = parseInt(boton.dataset.id || '', 10);
    const nombre = boton.dataset.nombre;
    // El precio y la imagen no son estrictamente necesarios para el backend de `addUpCarritoItem`,
    // pero se mantienen para la consistencia si se usaran en el frontend para el toast.
    const precioString = boton.dataset.precio; 
    const imagen = boton.dataset.imagen; 

    if (!id || !nombre) {
        console.error("Faltan datos (ID o nombre) para agregar el juego al carrito.");
        mostrarMensajeToast("Error: Datos incompletos del juego.");
        return;
    }

    const token = localStorage.getItem('userToken'); // O 'adminToken' si es el token general de usuario
    if (!token) {
        mostrarMensajeToast("Debes iniciar sesión para agregar ítems al carrito.");
        return;
    }

    const API_BASE_URL = 'http://localhost:3001/api/carrito';

    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ juegoId: id, cantidad: 1 }), // Siempre añade 1 unidad al hacer clic en este botón
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al añadir el ítem al carrito.');
        }

        // Si la operación fue exitosa, muestra un mensaje al usuario
        mostrarMensajeToast(`¡Se añadió "${nombre}" al carrito!`);

        // Opcional: Disparar un evento personalizado para notificar a otros componentes (ej. BarraCarrito)
        // que el carrito ha sido actualizado y deberían refrescar sus datos.
        window.dispatchEvent(new Event('carritoActualizado'));

    } catch (error: any) {
        console.error("Error al agregar al carrito:", error);
        mostrarMensajeToast(`Error: ${error.message || "No se pudo añadir al carrito."}`);
    }
};
