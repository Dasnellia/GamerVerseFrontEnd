import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../../css/Catalogo.css";
import Logo from "../../imagenes/LogoRecuperarContraseña.png";
import{
  productosIniciales,
  type Comentario,
} from "./DetalleJuego";
import type { Juego as JuegoCompleto } from "./DetalleJuego";

import {
  mostrarMensajeToast,
  handleAgregarAlCarrito as handleAgregarAlCarritoBase,
} from "../carrito/DetalleCarrito";
import Slider from "rc-slider";
  
import { Dropdown } from "react-bootstrap";

// Interfaz para la información básica de un juego
interface JuegoBasico {
  id: number;
  nombre: string;
  precio: number;
  plataformas: string[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
}

const juegosIniciales: JuegoBasico[] = productosIniciales.map((juego) => ({
  id: juego.id,
  nombre: juego.nombre,
  precio: juego.precio,
  plataformas: juego.plataformas,
  descuento: juego.descuento,
  rating: juego.rating,
  imagen: juego.imagen,
  descripcion: juego.descripcion,
}));

function BarraNav({ onAbrirFiltroLateral }: { onAbrirFiltroLateral: () => void }) {
  const location = useLocation();
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] =
    useState(productosIniciales);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<
    typeof productosIniciales
  >([]);
  const [mostrarSugerenciasBusqueda, setMostrarSugerenciasBusqueda] =
    useState(false);
  const refBusqueda = useRef<HTMLInputElement>(null);
  const maxPrecioDisponible = Math.max(
    ...productosIniciales.map((p) => p.precio)
  );
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([
    0,
    maxPrecioDisponible,
  ]);
  const [mostrarFiltroLateral, setMostrarFiltroLateral] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] =
    useState<JuegoCompleto | null>(null);
  
  const [listaProductos, setListaProductos] = useState(productosIniciales);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<
    string[]
  >([]); // --- Funciones de Manejo de Filtros y Búsqueda ---

  const handleCambioRangoPrecio = (valor: number | number[]) => {
    if (Array.isArray(valor)) {
      setRangoPrecio([valor[0], valor[1]]);
    }
  };

  const aplicarFiltrosProductos = () => {
    const nombreNormalizado = nombreBusqueda.toLowerCase();
    const [precioMinimo, precioMaximo] = rangoPrecio;

    const productosFiltradosActuales = listaProductos.filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(nombreNormalizado);
      const coincidePrecio =
        producto.precio >= precioMinimo && producto.precio <= precioMaximo;
      const coincidePlataforma =
        plataformasSeleccionadas.length === 0 ||
        producto.plataformas.some((p) => plataformasSeleccionadas.includes(p));

      return coincideNombre && coincidePrecio && coincidePlataforma;
    });

    setProductosFiltrados(productosFiltradosActuales);
  };

  useEffect(() => {
    aplicarFiltrosProductos();
  }, [nombreBusqueda, rangoPrecio, plataformasSeleccionadas, listaProductos]);

  const obtenerTodasLasPlataformas = [
    ...new Set(productosIniciales.flatMap((p) => p.plataformas)),
  ];



  const handleCambioNombreBusqueda = (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    const nuevoNombre = evento.target.value;
    setNombreBusqueda(nuevoNombre);

    const nuevasSugerencias = listaProductos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()) &&
        nuevoNombre.length > 0
    );
    setSugerenciasBusqueda(nuevasSugerencias);
    setMostrarSugerenciasBusqueda(nuevasSugerencias.length > 0);
  };

  const handleClicBuscar = () => {
    aplicarFiltrosProductos();
    setMostrarSugerenciasBusqueda(false);
    mostrarMensajeToast(`Búsqueda realizada para: "${nombreBusqueda}"`);
  };

  const seleccionarSugerenciaBusqueda = (nombre: string) => {
    setNombreBusqueda(nombre);
    setSugerenciasBusqueda([]);
    setMostrarSugerenciasBusqueda(false);
    aplicarFiltrosProductos();
  };

  const alternarFiltroLateral = () => {
    setMostrarFiltroLateral(!mostrarFiltroLateral);
  };

  const handleCambioPlataforma = (evento: ChangeEvent<HTMLInputElement>) => {
    const plataforma = evento.target.value;
    const estaMarcado = evento.target.checked;

    setPlataformasSeleccionadas((prev) => {
      if (estaMarcado) {
        return [...prev, plataforma];
      } else {
        return prev.filter((p) => p !== plataforma);
      }
    });
  };

  const handleAgregarComentario = (
    juegoId: number,
    comentario: Omit<Comentario, "id" | "date">
  ) => {
    setListaProductos((prevProductos) =>
      prevProductos.map((juego) => {
        if (juego.id === juegoId) {
          const nuevoComentario = {
            ...comentario,
            id: juego.comentarios.length + 1,
            date: new Date().toISOString().split("T")[0],
          };
          return {
            ...juego,
            comentarios: [...juego.comentarios, nuevoComentario],
          };
        }
        return juego;
      })
    );

    if (juegoSeleccionado && juegoSeleccionado.id === juegoId) {
      const nuevoComentario = {
        ...comentario,
        id: juegoSeleccionado.comentarios.length + 1,
        date: new Date().toISOString().split("T")[0],
      };
      setJuegoSeleccionado({
        ...juegoSeleccionado,
        comentarios: [...juegoSeleccionado.comentarios, nuevoComentario],
      });
    }
  };

  return (
    <div id="">
        
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top game-verse-navbar">
               
        <div className="container">
                   
          <Link className="navbar-brand" to="/Inicio">
                       
            <img
              src={Logo}
              alt="Game Verse Logo"
              width="45"
              className="rounded-circle border border-danger"
            />
            Game Verse          
          </Link>
                   
          <form
            className="d-flex mx-auto position-relative w-50"
            id="barraBusquedaContainer"
          >
            {location.pathname === "/Catalogo" && (
              <button
                className="btn btn-outline-light me-2"
                type="button"
                onClick={onAbrirFiltroLateral}
              >
                              <i className="bi bi-sliders"></i>           
              </button>
            )}
                       
            <input
              ref={refBusqueda}
              className="form-control me-4"
              type="search"
              placeholder="Buscar juegos..."
              aria-label="Buscar"
              value={nombreBusqueda}
              onChange={handleCambioNombreBusqueda}
            />
                       
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={handleClicBuscar}
            >
                            Buscar            
            </button>
                       
            {mostrarSugerenciasBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul
                className="list-group position-absolute mt-2 w-100 bg-light border rounded shadow-sm"
                style={{ zIndex: 1000, top: "100%" }}
              >
                               
                {sugerenciasBusqueda.map((producto) => (
                  <li
                    key={producto.id}
                    className="list-group-item list-group-item-action"
                    onClick={() =>
                      seleccionarSugerenciaBusqueda(producto.nombre)
                    }
                  >
                                        {producto.nombre}                 
                  </li>
                ))}
                             
              </ul>
            )}
                     
          </form>
                   
          <Link className="btn btn-sm btn-outline-light" to="/Perfil">
                       
            <i className="bi bi-person-fill" style={{ fontStyle: "normal" }}>
              
              Mi Cuenta
            </i>
                     
          </Link>
                 
        </div>
             
      </nav>
           
      {/* Segunda barra de navegación con dropdowns (MODIFICADA para usar react-bootstrap) */}
           
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
               
        <div className="container">
                   
          <div className="w-100">
                       
            <ul className="nav justify-content-center">
                            {/* Dropdown "Inicio" con react-bootstrap */}       
                   
              <Dropdown as="li" className="nav-item">
                               
                <Dropdown.Toggle as={Link} to="#" className="nav-link">
                                    Inicio                
                </Dropdown.Toggle>
                               
                <Dropdown.Menu>
                                   
                  <Dropdown.Item as={Link} to="/Inicio">
                    Destacados
                  </Dropdown.Item>
                                   
                  <Dropdown.Item as={Link} to="/Inicio">
                    Ofertas
                  </Dropdown.Item>
                                   
                  <Dropdown.Item as={Link} to="/Inicio">
                    Próximos lanzamientos
                  </Dropdown.Item>
                                 
                </Dropdown.Menu>
                             
              </Dropdown>
                            {/* Enlace directo "Catálogo" */}             
              <li className="nav-item">
                               
                <Link className="nav-link" to="/Catalogo">
                  Catálogo
                </Link>
                             
              </li>
                            {/* Dropdown "Plataformas" con react-bootstrap */} 
                         
              <Dropdown as="li" className="nav-item">
                               
                <Dropdown.Toggle as={Link} to="#" className="nav-link">
                                    Plataformas                
                </Dropdown.Toggle>
                               
                <Dropdown.Menu>
                                   
                  <Dropdown.Item as={Link} to="/Catalogo?platform=PC">
                    PC
                  </Dropdown.Item>
                                   
                  <Dropdown.Item as={Link} to="/Catalogo?platform=PS5">
                    PlayStation 5
                  </Dropdown.Item>
                                   
                  <Dropdown.Item as={Link} to="/Catalogo?platform=XBOX">
                    Xbox Series X
                  </Dropdown.Item>
                                   
                  <Dropdown.Item as={Link} to="/Catalogo?platform=SWITCH">
                    Nintendo Switch
                  </Dropdown.Item>
                                 
                </Dropdown.Menu>
                             
              </Dropdown>
                            {/* Enlaces directos */}             
              <li className="nav-item">
                               
                <Link className="nav-link" to="/MasVendidos">
                  Más vendidos
                </Link>
                             
              </li>
                           
              <li className="nav-item">
                               
                <Link className="nav-link" to="/MejorValorados">
                  Mejor valorados
                </Link>
                             
              </li>
                           
              <li className="nav-item">
                               
                <Link className="nav-link" to="/Carrito">
                  <i
                    className="bi bi-cart-fill"
                    style={{ fontSize: "1em", marginRight: "0.1em" }}
                  ></i>
                  Carrito
                </Link>
                             
              </li>
                         
            </ul>
                     
          </div>
                 
        </div>
             
      </nav>
           
      <div className="container-fluid mt-4">
               
        <div className="row">
                   
          {mostrarFiltroLateral && (
            <div className="col-md-3 filtro-lateral bg-dark p-3 shadow-sm">
                            <h5 className="mb-3">Filtrar por Precio</h5>       
                   
              <div className="mb-3">
                               
                <Slider
                  range
                  min={0}
                  max={maxPrecioDisponible}
                  value={rangoPrecio}
                  onChange={handleCambioRangoPrecio}
                  trackStyle={[{ backgroundColor: "red" }]}
                  handleStyle={[
                    { borderColor: "red", backgroundColor: "red" },
                    { borderColor: "red", backgroundColor: "red" },
                  ]}
                />
                               
                <div className="d-flex justify-content-between align-items-center mt-2">
                                   
                  <span>Min: S/ {rangoPrecio[0].toFixed(2)}</span>             
                      <span>Max: S/ {rangoPrecio[1].toFixed(2)}</span>         
                       
                </div>
                             
              </div>
                            <h5 className="mb-2">Filtrar por Plataforma</h5>   
                       
              <div className="d-flex flex-column">
                               
                {obtenerTodasLasPlataformas.map((plataforma) => (
                  <div key={plataforma} className="form-check">
                                       
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={plataforma}
                      id={`plataforma-${plataforma}`}
                      onChange={handleCambioPlataforma}
                      checked={plataformasSeleccionadas.includes(plataforma)}
                    />
                                       
                    <label
                      className="form-check-label"
                      htmlFor={`plataforma-${plataforma}`}
                    >
                                            {plataforma}                   
                    </label>
                                     
                  </div>
                ))}
                             
              </div>
                           
              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={alternarFiltroLateral}
              >
                                Cerrar Filtro              
              </button>
                         
            </div>
          )}
                   

        </div>
             
      </div>

    </div>
  );
}

export default BarraNav;
