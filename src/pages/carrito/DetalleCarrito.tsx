export interface CarritoItem {
  id: number;
  nombre: string;
  precio?: number;
  cantidad: number;
  imagen?: string;
}

import EldenRing from '../../imagenes/Juegos/EldenRing.png';
import ZeldaTears from '../../imagenes/Juegos/LoZTofk.jpg';
import Cyberpunk from '../../imagenes/Juegos/cyberpunkcard.jpg';
import GodOfWar from '../../imagenes/Juegos/god-of-war.jpg';
import HogwartsLegacy from '../../imagenes/Juegos/hogwartlegacy.jpeg';
import ResidentEvil4 from '../../imagenes/Juegos/ResidentEVIL4Remake.jpg';
import Starfield from '../../imagenes/Juegos/Starfield.webp';
import FinalFantasyXVI from '../../imagenes/Juegos/Final-fantasy-XVI.png';
import DarkSoul from '../../imagenes/Juegos/DarkSouls.jpg';
import Expedition33 from '../../imagenes/Juegos/Expedition33.avif';
import StellarBlade from '../../imagenes/Juegos/StellarBlade.jpg';
import ARK from '../../imagenes/Juegos/ARK.jpg';
import GTA from '../../imagenes/Juegos/GTA5.jpg';
import Minecraft from '../../imagenes/Juegos/Minecraft.png';
import KingdomHearts from '../../imagenes/Juegos/KingdomHearts.jpg';
import ResidentEvilVillage from '../../imagenes/Juegos/ResidentEvil8.jpg';

// Conexion para Imagenes
export const imagenes = {
  "The Legend of Zelda: Tears of the Kingdom": ZeldaTears,
  "Cyberpunk 2077": Cyberpunk,
  "Elden Ring": EldenRing,
  "God of War Ragnarök": GodOfWar,
  "Hogwarts Legacy": HogwartsLegacy,
  "Resident Evil 4 Remake": ResidentEvil4,
  "Starfield": Starfield,
  "Final Fantasy XVI": FinalFantasyXVI,
  "Dark Soul": DarkSoul,
  "Expedition 33": Expedition33,
  "Stellar Blade": StellarBlade,
  "ARK": ARK,
  "GTA": GTA,
  "Minecraft": Minecraft,
  "Kingdom Hearts": KingdomHearts,
  "Resident Evil Village": ResidentEvilVillage
};

// Mostrar mensajito
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

// Agregar Carrito
export const handleAgregarAlCarrito = (event: React.MouseEvent<HTMLButtonElement>) => {
    const boton = event.currentTarget; 
    const id = parseInt(boton.dataset.id || '', 10); 
    const nombre = boton.dataset.nombre; 
    const precioString = boton.dataset.precio;
    const precio = precioString ? parseFloat(precioString) : undefined;
    const imagen = boton.dataset.imagen; 

    if (id && nombre && precio !== undefined && imagen) {
        const productoAAgregar = { id, nombre, precio, imagen }; 

        const carritoGuardado = localStorage.getItem('carrito'); 
        const carrito = carritoGuardado ? JSON.parse(carritoGuardado) as CarritoItem[] : []; 

        const productoExistenteIndex = carrito.findIndex(item => item.id === id);

        // Si el producto existe lo copia a carrito
        if (productoExistenteIndex > -1) { 
            const nuevoCarrito = [...carrito];
            nuevoCarrito[productoExistenteIndex].cantidad = (nuevoCarrito[productoExistenteIndex].cantidad || 0) + 1;
            localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Guarda carrito actualizado

        // Si el producto no existe
        } else { 
            const nuevoItem = { ...productoAAgregar, cantidad: 1 }; 
            localStorage.setItem('carrito', JSON.stringify([...carrito, nuevoItem])); 
        }
        mostrarMensajeToast(`¡Se añadió ${nombre} al carrito!`); 
    }
};