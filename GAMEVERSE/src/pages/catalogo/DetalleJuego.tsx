import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/DetalleJuego.css';
import { handleAgregarAlCarrito } from '../carrito/DetalleCarrito';
// Imágenes para galerías
import EldenRing from '../../imagenes/Juegos/EldenRing.png';
import ZeldaTears from '../../imagenes/Juegos/LoZTofk.jpg';
import Cyberpunk from '../../imagenes/Juegos/cyberpunk.avif';
import GodOfWar from '../../imagenes/Juegos/god-of-war.jpg';
import HogwartsLegacy from '../../imagenes/Juegos/hogwartlegacy.jpeg';
import ResidentEvil4 from '../../imagenes/Juegos/ResidentEVIL4Remake.jpg';
import Starfield from '../../imagenes/Juegos/Starfield.webp';
import FinalFantasyXVI from '../../imagenes/Juegos/Final-fantasy-XVI.png';
import Minecraft from '../../imagenes/Juegos/Minecraft.png'
import StellarBlade from '../../imagenes/Juegos/StellarBlade.jpg'
import Expedition33 from '../../imagenes/Juegos/Expedition33.avif'
import KingdomHearts from '../../imagenes/Juegos/KingdomHearts.jpg'
import GTA5 from '../../imagenes/Juegos/GTA5.jpg'
import ResidentEvil8 from '../../imagenes/Juegos/ResidentEvil8.jpg'
import DarkSouls from '../../imagenes/Juegos/DarkSouls.jpg'
import ARK from '../../imagenes/Juegos/ARK.jpg'


// Elden Ring
import EldenRing1 from '../../imagenes/Juegos/EldenRing1.jpg';
import EldenRing2 from '../../imagenes/Juegos/EldenRing2.jpg';
import EldenRing3 from '../../imagenes/Juegos/EldenRing3.jpg';
import EldenRing4 from '../../imagenes/Juegos/EldenRing4.jpg';

// Zelda
import Zelda1 from '../../imagenes/Juegos/Zelda1.jpeg';
import Zelda2 from '../../imagenes/Juegos/Zelda2.jpeg';
import Zelda3 from '../../imagenes/Juegos/Zelda3.jpeg';
import Zelda4 from '../../imagenes/Juegos/Zelda4.jpeg';

// Cyberpunk
import Cyberpunk1 from '../../imagenes/Juegos/Cyberpunk1.jpg';
import Cyberpunk2 from '../../imagenes/Juegos/Cyberpunk2.jpg';
import Cyberpunk3 from '../../imagenes/Juegos/Cyberpunk3.jpg';
import Cyberpunk4 from '../../imagenes/Juegos/Cyberpunk4.jpg';

// God of War
import GodOfWar1 from '../../imagenes/Juegos/GodOfWar1.jpg';
import GodOfWar2 from '../../imagenes/Juegos/GodOfWar2.jpg';
import GodOfWar3 from '../../imagenes/Juegos/GodOfWar3.jpg';
import GodOfWar4 from '../../imagenes/Juegos/GodOfWar4.jpg';

// Hogwarts Legacy
import Hogwarts1 from '../../imagenes/Juegos/Hogwarts1.jpg';
import Hogwarts2 from '../../imagenes/Juegos/Hogwarts2.jpg';
import Hogwarts3 from '../../imagenes/Juegos/Hogwarts3.jpg';
import Hogwarts4 from '../../imagenes/Juegos/Hogwarts4.jpg';

// Resident Evil 4
import ResidentEvil1 from '../../imagenes/Juegos/ResidentEvil1.jpg';
import ResidentEvil2 from '../../imagenes/Juegos/ResidentEvil2.jpg';
import ResidentEvil3 from '../../imagenes/Juegos/ResidentEvil3.jpg';
import ResidentEvil from '../../imagenes/Juegos/ResidentEvil4.jpg';

// Starfield
import Starfield1 from '../../imagenes/Juegos/Starfield1.jpg';
import Starfield2 from '../../imagenes/Juegos/Starfield2.jpg';
import Starfield3 from '../../imagenes/Juegos/Starfield3.jpg';
import Starfield4 from '../../imagenes/Juegos/Starfield4.jpg';

// Final Fantasy XVI
import FFXVI1 from '../../imagenes/Juegos/FFXVI1.jpg';
import FFXVI2 from '../../imagenes/Juegos/FFXVI2.jpg';
import FFXVI3 from '../../imagenes/Juegos/FFXVI3.jpg';
import FFXVI4 from '../../imagenes/Juegos/FFXVI4.jpg';

// Minecraft
import Minecraft1 from '../../imagenes/Juegos/Minecraft1.jpg'
import Minecraft2 from '../../imagenes/Juegos/Minecraft2.jpg'
import Minecraft3 from '../../imagenes/Juegos/Minecraft3.jpg'
import Minecraft4 from '../../imagenes/Juegos/Minecraft4.jpg'

//StellarBlade
import StellarBlade1 from '../../imagenes/Juegos/StellarBlade1.jpg'
import StellarBlade2 from '../../imagenes/Juegos/StellarBlade2.jpg'
import StellarBlade3 from '../../imagenes/Juegos/StellarBlade3.jpg'
import StellarBlade4 from '../../imagenes/Juegos/StellarBlade4.jpg'

//Expedition33
import Expedition1 from '../../imagenes/Juegos/Expedition1.jpg'
import Expedition2 from '../../imagenes/Juegos/Expedition2.jpg'
import Expedition3 from '../../imagenes/Juegos/Expedition3.jpg'
import Expedition4 from '../../imagenes/Juegos/Expedition4.jpg'

//KingdomHearts
import KH1 from '../../imagenes/Juegos/KH1.jpg'
import KH2 from '../../imagenes/Juegos/KH2.jpg'
import KH3 from '../../imagenes/Juegos/KH3.jpg'
import KH4 from '../../imagenes/Juegos/KH4.jpg'

//Gta5
import GTA1 from '../../imagenes/Juegos/GTA1.jpg'
import GTA2 from '../../imagenes/Juegos/GTA2.jpg'
import GTA3 from '../../imagenes/Juegos/GTA3.jpg'
import GTA4 from '../../imagenes/Juegos/GTA4.jpg'

//RE8
import RE8_1 from '../../imagenes/Juegos/RE8_1.jpg'
import RE8_2 from '../../imagenes/Juegos/RE8_2.jpg'
import RE8_3 from '../../imagenes/Juegos/RE8_3.jpg'
import RE8_4 from '../../imagenes/Juegos/RE8_4.jpg'

//DarkSoul
import DS1 from '../../imagenes/Juegos/DS1.jpg'
import DS2 from '../../imagenes/Juegos/DS2.jpg'
import DS3 from '../../imagenes/Juegos/DS3.jpg'
import DS4 from '../../imagenes/Juegos/DS4.jpg'

//ARK
import ARK1 from '../../imagenes/Juegos/ARK1.jpg'
import ARK2 from '../../imagenes/Juegos/ARK2.jpg'
import ARK3 from '../../imagenes/Juegos/ARK3.jpg'
import ARK4 from '../../imagenes/Juegos/ARK4.jpg'


// Interfaces de tipos
export interface Comentario {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Juego {
  id: number;
  nombre: string;
  precio: number;
  plataformas: string[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
  descripcionLarga: string;
  trailerUrl: string;
  galleryImages: string[];
  caracteristicas: string[];
  generos: string[];
  comentarios: Comentario[];
  lanzamiento: string;
}

// Datos completos de los juegos
export const productosIniciales: Juego[] = [
  {
    id: 1,
    nombre: 'Elden Ring',
    precio: 139.30,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 30,
    rating: 4.9,
    imagen: EldenRing,
    descripcion: 'Un épico RPG de acción en un mundo abierto.',
    descripcionLarga: 'Levántate, Sinluz, y recorre las Tierras Intermedias para convertirte en un Señor de Elden.',
    trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
    galleryImages: [EldenRing1, EldenRing2, EldenRing3, EldenRing4],
    caracteristicas: [
      'Exploración libre en mundo abierto',
      'Desafiantes batallas contra jefes',
      'Amplia personalización del personaje',
      'Multijugador cooperativo y competitivo'
    ],
    generos: ['RPG', 'Acción', 'Mundo abierto'],
    comentarios: [
      {
        id: 1,
        user: 'JugadorSouls',
        rating: 5,
        text: 'Una obra maestra absoluta.',
        date: '2023-05-15'
      },
      {
        id: 2,
        user: 'AlexUwu',
        rating: 4,
        text: 'Muy bueno pero difícil.',
        date: '2023-04-22'
      }
    ],
    lanzamiento: '25-02-2022'
  },
  {
    id: 2,
    nombre: 'The Legend of Zelda: Tears of the Kingdom',
    precio: 249.00,
    plataformas: ['SWITCH'],
    descuento: 0,
    rating: 5.0,
    imagen: ZeldaTears,
    descripcion: 'Secuela que expande el mundo de Hyrule con nuevas mecánicas.',
    descripcionLarga: 'Explora los cielos y la tierra de Hyrule con nuevas herramientas y poderes únicos.',
    trailerUrl: 'https://www.youtube.com/embed/uHGShqcAHlQ',
    galleryImages: [Zelda1, Zelda2, Zelda3, Zelda4],
    caracteristicas: [
      'Exploración vertical',
      'Puzzles innovadores',
      'Interacción ambiental',
      'Narrativa inmersiva'
    ],
    generos: ['Aventura', 'Acción', 'Mundo abierto', 'Puzzles'],
    comentarios: [
      {
        id: 1,
        user: 'Nintendero',
        rating: 5,
        text: 'Superó todas mis expectativas.',
        date: '2023-05-12'
      }
    ],
    lanzamiento: '12-05-2023',
  },
  {
    id: 3,
    nombre: 'Cyberpunk 2077',
    precio: 89.50,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 50,
    rating: 4.5,
    imagen: Cyberpunk,
    descripcion: 'Un RPG futurista con combate en primera persona.',
    descripcionLarga: 'Vive como un mercenario en una ciudad futurista dominada por megacorporaciones.',
    trailerUrl: 'https://www.youtube.com/embed/LembwKDo1Dk',
    galleryImages: [Cyberpunk1, Cyberpunk2, Cyberpunk3, Cyberpunk4],
    caracteristicas: [
      'Narrativa ramificada',
      'Combate con armas y hacking',
      'Customización de cuerpo y mente',
      'Ciudad futurista inmersiva'
    ],
    generos: ['RPG', 'Shooter', 'Ciencia ficción'],
    comentarios: [
      {
        id: 1,
        user: 'Culchinchin',
        rating: 1,
        text: 'El juego no me corre en mi pc :C',
        date: '2023-06-10'
      }
    ],
    lanzamiento: '10-12-2020',
  },
  {
    id: 4,
    nombre: 'God of War Ragnarök',
    precio: 229.00,
    plataformas: ['PS5'],
    descuento: 0,
    rating: 4.9,
    imagen: GodOfWar,
    descripcion: 'Acción épica con Kratos en la mitología nórdica.',
    descripcionLarga: 'Viaja por los nueve reinos enfrentando desafíos y deidades nórdicas.',
    trailerUrl: 'https://www.youtube.com/embed/EE-4GvjKcfs',
    galleryImages: [GodOfWar1, GodOfWar2, GodOfWar3, GodOfWar4],
    caracteristicas: [
      'Narrativa cinemática',
      'Combate con hacha y espadas',
      'Relación padre-hijo',
      'Viaje por múltiples mundos'
    ],
    generos: ['Acción', 'Aventura', 'Hack and Slash'],
    comentarios: [
      {
        id: 1,
        user: '__Daniel__',
        rating: 5,
        text: 'Una conclusión perfecta para la historia de Kratos.',
        date: '2023-05-20'
      }
    ],
    lanzamiento: '09-11-2022',
  },
  {
    id: 5,
    nombre: 'Hogwarts Legacy',
    precio: 219.00,
    plataformas: ['PS5', 'XBOX', 'PC', 'SWITCH'],
    descuento: 0,
    rating: 4.7,
    imagen: HogwartsLegacy,
    descripcion: 'RPG de acción en el mundo mágico de Harry Potter.',
    descripcionLarga: 'Descubre secretos mágicos, lanza hechizos y vive tu aventura en Hogwarts.',
    trailerUrl: 'https://www.youtube.com/embed/1O6Qstncpnc',
    galleryImages: [Hogwarts1, Hogwarts2, Hogwarts3, Hogwarts4],
    caracteristicas: [
      'Exploración libre en Hogwarts',
      'Sistema de clases mágicas',
      'Duelo de hechizos',
      'Criaturas mágicas y pociones'
    ],
    generos: ['RPG', 'Aventura', 'Fantasía'],
    comentarios: [
      {
        id: 1,
        user: 'Harry',
        rating: 4,
        text: 'Se ve con buenos gráficos en PC pero en Switch...',
        date: '2023-02-20'
      }
    ],
    lanzamiento: '10-02-2023',
  },
  {
    id: 6,
    nombre: 'Resident Evil 4 Remake',
    precio: 199.00,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 20,
    rating: 4.8,
    imagen: ResidentEvil4,
    descripcion: 'Remake de un clásico de terror y acción.',
    descripcionLarga: 'Leon Kennedy viaja a un pueblo remoto para rescatar a la hija del presidente.',
    trailerUrl: 'https://www.youtube.com/embed/O75Ip4o1bs8',
    galleryImages: [ResidentEvil1, ResidentEvil2, ResidentEvil3, ResidentEvil],
    caracteristicas: [
      'Terror de supervivencia',
      'Nuevas mecánicas de combate',
      'Gráficos actualizados',
      'Atmósfera inmersiva'
    ],
    generos: ['Terror', 'Acción', 'Survival Horror'],
    comentarios: [
      {
        id: 1,
        user: 'SurvivalHorrorFan',
        rating: 5,
        text: 'Fiel pero innovador.',
        date: '2023-03-24'
      }
    ],
    lanzamiento: '24-03-2023',
  },
  {
    id: 7,
    nombre: 'Starfield',
    precio: 249.00,
    plataformas: ['XBOX', 'PC'],
    descuento: 0,
    rating: 4.3,
    imagen: Starfield,
    descripcion: 'RPG espacial con exploración de cientos de planetas.',
    descripcionLarga: 'Descubre tu destino entre las estrellas en una galaxia sin límites.',
    trailerUrl: 'https://www.youtube.com/embed/pYqyVpCV-3c',
    galleryImages: [Starfield1, Starfield2, Starfield3, Starfield4],
    caracteristicas: [
      'Exploración espacial',
      'Creación de naves',
      'Misiones dinámicas',
      'Facciones y decisiones'
    ],
    generos: ['RPG', 'Ciencia ficción', 'Exploración espacial'],
    comentarios: [
      {
        id: 1,
        user: 'Pilerooo',
        rating: 4,
        text: 'Un universo increíble.',
        date: '2023-09-06'
      }
    ],
    lanzamiento: '06-09-2023',
  },
  {
    id: 8,
    nombre: 'Final Fantasy XVI',
    precio: 239.00,
    plataformas: ['PS5'],
    descuento: 10,
    rating: 4.7,
    imagen: FinalFantasyXVI,
    descripcion: 'Una nueva entrega de la saga con enfoque más maduro.',
    descripcionLarga: 'Los destinos de clanes y Eikons colisionan en esta historia épica.',
    trailerUrl: 'https://www.youtube.com/embed/iaJ4VVFGIa8',
    galleryImages: [FFXVI1, FFXVI2, FFXVI3, FFXVI4],
    caracteristicas: [
      'Combate rápido',
      'Poderes elementales de Eikons',
      'Narrativa oscura',
      'Gran trabajo de doblaje y cinemáticas'
    ],
    generos: ['RPG', 'Acción', 'Fantasía'],
    comentarios: [
      {
        id: 1,
        user: 'FFLegend',
        rating: 5,
        text: 'Una de las mejores historias.',
        date: '2023-06-22'
      }
    ],
    lanzamiento: '22-06-2023',
  },
  {
    id: 9,
    nombre: 'Minecraft',
    precio: 99.00,
    plataformas: ['PS5', 'XBOX', 'PC', 'SWITCH'],
    descuento: 20,
    rating: 4.8,
    imagen: Minecraft,
    descripcion: 'El famoso juego de mundo abierto donde puedes construir y explorar infinitamente.',
    descripcionLarga: 'Crea, explora y sobrevive en un mundo generado proceduralmente lleno de bloques. Juega en modo creativo o supervivencia con amigos.',
    trailerUrl: 'https://www.youtube.com/embed/MmB9b5njVbA',
    galleryImages: [Minecraft1, Minecraft2, Minecraft3, Minecraft4],
    caracteristicas: [
      'Mundo infinito generado proceduralmente',
      'Modos creativo y supervivencia',
      'Multijugador online',
      'Actualizaciones constantes'
    ],
    comentarios: [
      {
        id: 1,
        user: 'BlockBuilder',
        rating: 5,
        text: 'El mejor juego sandbox de todos los tiempos. Las posibilidades son infinitas.',
        date: '2023-01-10'
      }
    ],
    lanzamiento: '18-11-2011',
    generos: ['Sandbox', 'Supervivencia', 'Creativo'],
  },
  {
    id: 10,
    nombre: 'Stellar Blade',
    precio: 229.00,
    plataformas: ['PS5'],
    descuento: 0,
    rating: 4.6,
    imagen: StellarBlade,
    descripcion: 'Un espectacular juego de acción con combates intensos y un mundo futurista.',
    descripcionLarga: 'Controla a Eve en su misión para salvar a la humanidad de los NA:tives en este juego de acción con combates fluidos y un diseño visual impresionante.',
    trailerUrl: 'https://www.youtube.com/embed/DSznLWimMlU',
    galleryImages: [StellarBlade1, StellarBlade2, StellarBlade3, StellarBlade4],
    caracteristicas: [
      'Combate acción fluido',
      'Diseño de personajes detallado',
      'Mundo post-apocalíptico',
      'Sistema de habilidades especiales'
    ],
    comentarios: [
      {
        id: 1,
        user: 'ActionGamer',
        rating: 4,
        text: 'Los combates son increíbles y la protagonista tiene un diseño único.',
        date: '2023-11-15'
      }
    ],
    lanzamiento: '16-04-2024',
    generos: ['Acción', 'Aventura', 'Ciencia Ficción'],
  },
  {
    id: 11,
    nombre: 'Expedition 33',
    precio: 179.00,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 15,
    rating: 4.2,
    imagen: Expedition33,
    descripcion: 'Un juego por turnos en el somos la expedición 33.',
    descripcionLarga: 'Una vez al año, la Peintresse se despierta y pinta un número en el Monolito. Un número maldito. Todas las personas de esa edad se convierten de pronto en humo, esfumándose en el aire.',
    trailerUrl: 'https://www.youtube.com/embed/o9KQ4rlymEQ',
    galleryImages: [Expedition1, Expedition2, Expedition3, Expedition4],
    caracteristicas: [
      'Historia psicológica',
      'Gráficos atmosféricos',
      'RPG por turnos',
    ],
    comentarios: [
      {
        id: 1,
        user: 'SpaceHorrorFan',
        rating: 5,
        text: 'Es candidato para GOTY',
        date: '2023-08-22'
      }
    ],
    lanzamiento: '24-04-2025',
    generos: ['RPG', 'Por turnos', 'Narrativo'],
  },
  {
    id: 12,
    nombre: 'Kingdom Hearts III',
    precio: 239.00,
    plataformas: ['PS5', 'PC'],
    descuento: 0,
    rating: 4.7,
    imagen: KingdomHearts,
    descripcion: 'La continuación de la épica saga que combina Disney y Final Fantasy.',
    descripcionLarga: 'Sora regresa en una nueva aventura a través de mundos nunca antes vistos, con nuevos personajes y un sistema de combate renovado.',
    trailerUrl: 'https://www.youtube.com/embed/zrunNL3xsUY',
    galleryImages: [KH1, KH2, KH3, KH4],
    caracteristicas: [
      'Mundos Disney y Final Fantasy',
      'Sistema de combate mejorado',
      'Historia emocionante',
      'Nuevos personajes'
    ],
    comentarios: [
      {
        id: 1,
        user: 'DisneyRPGfan',
        rating: 5,
        text: 'Después de años de espera, valió completamente la pena. La evolución de la saga es increíble.',
        date: '2023-09-18'
      }
    ],
    lanzamiento: '29-01-2019',
    generos: ['RPG', 'Acción', 'Aventura', 'Fantasía'],
  },
  {
    id: 13,
    nombre: 'Grand Theft Auto V',
    precio: 149.00,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 40,
    rating: 4.9,
    imagen: GTA5,
    descripcion: 'El clásico juego de mundo abierto que redefine el género.',
    descripcionLarga: 'Vive las historias entrelazadas de Michael, Franklin y Trevor en la ciudad de Los Santos, llena de actividades, misiones y caos.',
    trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs',
    galleryImages: [GTA1, GTA2, GTA3, GTA4],
    caracteristicas: [
      'Mundo abierto masivo',
      'Tres protagonistas jugables',
      'Multijugador online (GTA Online)',
      'Gráficos mejorados para nueva generación'
    ],
    comentarios: [
      {
        id: 1,
        user: 'LosSantosVeteran',
        rating: 5,
        text: 'A pesar de los años, sigue siendo el rey de los juegos de mundo abierto.',
        date: '2023-07-05'
      }
    ],
    lanzamiento: '17-09-2013',
    generos: ['Acción', 'Mundo Abierto', 'Crimen'],
  },
  {
    id: 14,
    nombre: 'Resident Evil Village',
    precio: 179.00,
    plataformas: ['PS5', 'XBOX', 'PC'],
    descuento: 25,
    rating: 4.6,
    imagen: ResidentEvil8,
    descripcion: 'La terrorífica continuación de la saga Resident Evil.',
    descripcionLarga: 'Ethan Winters regresa en una nueva pesadilla llena de horrores sobrenaturales en un misterioso pueblo europeo.',
    trailerUrl: 'https://www.youtube.com/embed/arEdruKxrQ8',
    galleryImages: [RE8_1, RE8_2, RE8_3, RE8_4],
    caracteristicas: [
      'Terror en primera persona',
      'Nuevos enemigos memorables',
      'Arsenal de armas mejorado',
      'Historia que continúa RE7'
    ],
    comentarios: [
      {
        id: 1,
        user: 'SurvivalHorrorLover',
        rating: 5,
        text: 'Lady Dimitrescu se robó el juego. Una de las mejores villanas de la saga.',
        date: '2023-05-30'
      }
    ],
    lanzamiento: '06-05-2021',
    generos: ['Terror', 'Survival Horror', 'Acción'],
  },
  {
    id: 15,
    nombre: 'Dark Souls: Remastered',
    precio: 129.00,
    plataformas: ['PS5', 'XBOX', 'PC', 'SWITCH'],
    descuento: 30,
    rating: 4.8,
    imagen: DarkSouls,
    descripcion: 'El clásico que definió un género, ahora remasterizado.',
    descripcionLarga: 'Experimenta el difícil pero gratificante mundo de Lordran con gráficos mejorados y rendimiento optimizado.',
    trailerUrl: 'https://www.youtube.com/embed/KfjG9ZLGBHE',
    galleryImages: [DS1, DS2, DS3, DS4],
    caracteristicas: [
      'Dificultad desafiante pero justa',
      'Diseño de niveles interconectados',
      'Sistema de combate preciso',
      'Gráficos y rendimiento mejorados'
    ],
    comentarios: [
      {
        id: 1,
        user: 'SoulsVeteran',
        rating: 5,
        text: 'La mejor manera de experimentar este clásico. Los 60fps cambian completamente el juego.',
        date: '2023-04-12'
      }
    ],
    lanzamiento: '23-05-2018',
    generos: ['RPG', 'Acción', 'Fantasía Oscura'],
  },
  {
    id: 16,
    nombre: 'ARK: Survival Evolved',
    precio: 159.00,
    plataformas: ['PS5', 'XBOX', 'PC', 'SWITCH'],
    descuento: 20,
    rating: 4.3,
    imagen: ARK,
    descripcion: 'Supervive y domina en una isla llena de dinosaurios y criaturas prehistóricas.',
    descripcionLarga: 'Caza, recolecta, construye bases y doma dinosaurios en este intenso juego de supervivencia en un mundo abierto prehistórico.',
    trailerUrl: 'https://www.youtube.com/embed/IMklgHkggrQ',
    galleryImages: [ARK1, ARK2, ARK3, ARK4],
    caracteristicas: [
      'Domesticación de dinosaurios',
      'Construcción de bases complejas',
      'Supervivencia en mundo abierto',
      'Multijugador online'
    ],
    comentarios: [
      {
        id: 1,
        user: 'DinoTamer',
        rating: 4,
        text: 'Montar un T-Rex nunca deja de ser divertido, aunque el juego tiene algunos bugs.',
        date: '2023-06-18'
      }
    ],
    lanzamiento: '17-06-2017',
    generos: ['Supervivencia', 'Aventura', 'Mundo Abierto'],
  }
];

export const juegosIniciales = productosIniciales.map(juego => ({
  id: juego.id,
  nombre: juego.nombre,
  precio: juego.precio,
  plataformas: juego.plataformas,
  descuento: juego.descuento,
  rating: juego.rating,
  imagen: juego.imagen,
  descripcion: juego.descripcion
}));

// Props del componente
interface DetalleJuegoProps {
  juego: Juego | null;
  show: boolean;
  onHide: () => void;
  onAddComment: (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => void;
}

// Componente principal
function DetalleJuego({ juego, show, onHide, onAddComment }: DetalleJuegoProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [usuarioRating, setUsuarioRating] = useState(5);

  if (!juego) return null;

  const handleRatingClick = (rating: number) => {
    setUsuarioRating(rating);
  };

  const handleAddComment = () => {
    if (nuevoComentario.trim() === '') return;
    
    onAddComment(juego.id, {
      user: "Tú",
      rating: usuarioRating,
      text: nuevoComentario
    });
    
    setNuevoComentario('');
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable contentClassName="custom-backdrop" id="detalle-juego-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">{juego.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <div className="row mt-5">
          {/* Trailer del juego */}
          <div className="col-md-6 d-flex flex-column">
            <div className="ratio ratio-16x9 mb-3">
              <iframe 
                src={juego.trailerUrl} 
                title={`${juego.nombre} Trailer`} 
                allowFullScreen
                className="custom-iframe"
              ></iframe>
            </div>
            
            {/* Galería de imágenes */}
            <div className="mt-3">
              <h6 className="custom-gallery-title">Galería</h6>
              <div className="row row-cols-4 g-2">
                {juego.galleryImages.map((img, index) => (
                  <div className="col" key={index}>
                    <img 
                      src={img} 
                      alt={`${juego.nombre} ${index + 1}`} 
                      className="img-thumbnail cursor-pointer custom-image-thumbnail" 
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      onClick={() => setExpandedImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal para imagen ampliada */}
          <Modal show={expandedImage !== null} onHide={() => setExpandedImage(null)} centered size="xl">
            <Modal.Header closeButton>
              <Modal.Title>{juego.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <img 
                src={expandedImage || ''} 
                alt="Ampliación" 
                className="img-fluid" 
                style={{ maxHeight: '70vh' }}
              />
            </Modal.Body>
          </Modal>

          {/* Descripción del juego */}
          <div className="col-md-6 d-flex flex-column">
            <h6 className="custom-description-title">Descripción</h6>
            <p className="custom-description-text">{juego.descripcionLarga}</p>

            <div className="mb-3">
            <h6 className="custom-release-date-title">Fecha de lanzamiento</h6>
            <p className="custom-release-date-text">{juego.lanzamiento}</p>
            </div>

            <div className="mb-3">
              <h6 className="custom-platforms-title">Plataformas</h6>
              <div>
                {juego.plataformas.map((plataforma) => (
                  <span key={plataforma} className="badge bg-secondary me-1">{plataforma}</span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="custom-features-title">Características</h6>
              <ul className="list-unstyled custom-features-list">
                {juego.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="custom-feature-item">{caracteristica}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="custom-genres-title">Géneros</h6>
              <div>
                {juego.generos.map((genero) => (
                  <span key={genero} className="badge bg-info me-1">{genero}</span>
                ))}
              </div>
            </div>

            <div className="d-flex flex-grow-1 align-items-center justify-content-between mb-0">
              <div>
                <h6 className="mb-0 custom-price-text">Precio: S/ {juego.precio.toFixed(2)}</h6>
                {juego.descuento > 0 && (
                  <small className="text-danger custom-discount-text">
                    {juego.descuento}% de descuento
                  </small>
                )}
              </div>
              <button
                className="btn btn-sm btn-primary"
                data-id={juego.id}
                data-nombre={juego.nombre}
                data-precio={juego.precio.toFixed(2)}
                data-imagen={juego.imagen}
                onClick={handleAgregarAlCarrito}
                >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        <div id="toast" className="toast"></div>
           
        {/* Reseñas */}
        <div className="mt-4">
          <h5 className="custom-reviews-title">Reseñas</h5>
          {juego.comentarios.map((comentario) => (
            <div key={comentario.id} className="card mb-2 custom-review-card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title custom-review-user">{comentario.user}</h6>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`bi ${i < comentario.rating ? 'bi-star-fill text-warning' : 'bi-star'} custom-review-star`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="card-text custom-review-text">{comentario.text}</p>
                <small className="text-muted custom-review-date">{comentario.date}</small>
              </div>
            </div>
          ))}
          
          {/* Añadir reseña */}
          {(
            <div className="mt-4 custom-add-review">
              <h5 className="custom-reviews-title">Añadir tu reseña</h5>
              <div className="mb-3">
                <label className="form-label text-white">Puntuación</label>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i}
                      className={`bi ${i < usuarioRating ? 'bi-star-fill text-warning' : 'bi-star'} fs-4 me-1 custom-rating-star`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRatingClick(i + 1)}
                    ></i>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control custom-review-textarea" 
                  rows={3} 
                  placeholder="Escribe tu reseña..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                ></textarea>
              </div>
              <button 
                className="btn btn-danger custom-submit-review-button"
                onClick={handleAddComment}
                disabled={!nuevoComentario.trim()}
              >
                Enviar reseña
              </button>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <button type="button" className="btn btn-danger" onClick={onHide}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetalleJuego;