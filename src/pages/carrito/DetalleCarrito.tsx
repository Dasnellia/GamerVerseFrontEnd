import React from 'react';

// El backend de carritoService devuelve: id, nombre, precio, cantidad, imagen, stockDisponible
export interface CarritoItem {
  id: number; // ID del juego
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string | null; 
  stockDisponible?: number; 
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

// Función para agregar un juego al carrito 
export const handleAgregarAlCarrito = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const boton = event.currentTarget;
    const id = parseInt(boton.dataset.id || '', 10);
    const nombre = boton.dataset.nombre;
    const precioString = boton.dataset.precio; 
    const imagen = boton.dataset.imagen; 

    if (!id || !nombre) {
        console.error("Faltan datos (ID o nombre) para agregar el juego al carrito.");
        mostrarMensajeToast("Error: Datos incompletos del juego.");
        return;
    }

    const token = localStorage.getItem('userToken'); 
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
            body: JSON.stringify({ juegoId: id, cantidad: 1 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al añadir el ítem al carrito.');
        }

        mostrarMensajeToast(`¡Se añadió "${nombre}" al carrito!`);

        window.dispatchEvent(new Event('carritoActualizado'));

    } catch (error: any) {
        console.error("Error al agregar al carrito:", error);
        mostrarMensajeToast(`Error: ${error.message || "No se pudo añadir al carrito."}`);
    }
};