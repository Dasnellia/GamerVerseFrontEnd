
import BarraCarrito from "../carrito/BarraCarrito";
import Footer from "./Footer";
import { useState } from "react";

import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'rc-slider/assets/index.css';

import "../../css/MasVendidos.css";
import BarraNav from "./BarraNavUser";



import DetalleJuego, {
  productosIniciales,
  type Comentario,
} from "./DetalleJuego";

import type { Juego as JuegoCompleto } from "./DetalleJuego";


const DibujarEstrellas = (rating: number) => {
  const totalestrella = Math.floor(rating);
  const mediaestrella = rating % 1 >= 0.5;
  const sinestrellas = 5 - totalestrella - (mediaestrella ? 1 : 0);

  return (
    <>
    
      {Array(totalestrella)
        .fill(null)
        .map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill"></i>
        ))}
      {mediaestrella && <i className="bi bi-star-half"></i>}
      {Array(sinestrellas)
        .fill(null)
        .map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star"></i>
        ))}
    </>
  );
};


const FilasPorJuego = (juegos: JuegoCompleto[]) => {
  return juegos.map((juego: JuegoCompleto, index: number) => (
    <tr key={juego.id}>
      <th scope="row">{index + 1}</th>
      <td>
        <img src={juego.imagen} className="game-cover" alt={juego.nombre} />
      </td>
      <td>
        <strong>{juego.nombre}</strong>
      </td>
      <td>{juego.generos.join(", ")}</td>
      <td>
        {juego.plataformas.map((plat: string, idx: number) => (
          <span key={idx} className="badge bg-secondary platform-badge">
            {plat}
          </span>
        ))}
      </td>
      <td className="rating">
        {DibujarEstrellas(juego.rating)}
        <span className="text-muted ms-2">{juego.rating.toFixed(1)}</span>
      </td>
      <td>{juego.lanzamiento.replace(/-/g, "/")}</td>
      <td className="price">S/ {juego.precio.toFixed(2)}</td>
      <td>
        <Link to="/Inicio" className="btn btn-sm btn-primary w-100 mb-1">
          Comprar
        </Link>
        <button className="btn btn-sm btn-secondary w-100">Detalles</button>
      </td>
    </tr>
  ));
};

const MasVendidos = () => {
  return (
    <div id="mas-vendidos-page-container">
      <BarraNav />

      <div className="container mt-4">
        <h1 className="page-title">
          Descubre los <strong>más vendidos</strong>
        </h1>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Portada</th>
                <th scope="col">Nombre del Juego</th>
                <th scope="col">Género</th>
                <th scope="col">Plataformas</th>
                <th scope="col">Valoración</th>
                <th scope="col">Lanzamiento</th>
                <th scope="col">Precio</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>{FilasPorJuego(productosIniciales.slice(0, 10))}</tbody>
          </table>
        </div>

         
      </div>

      <div>
        <BarraCarrito />
        <Footer />
      </div>
    </div>

  );
};

export default MasVendidos;
