import { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../css/Catalogo.css";
import type { Juego } from './DetalleJuego';
import { productosIniciales } from "./DetalleJuego";
import { mostrarMensajeToast } from "../carrito/DetalleCarrito";

interface FiltroProps {
  onFiltrar: (productos: Juego[]) => void;
}

function Filtro({ onFiltrar }: FiltroProps) {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<string[]>([]);
  const [mostrarFiltroLateral, setMostrarFiltroLateral] = useState(true); // Puedes controlarlo desde afuera si deseas
  const [listaProductos] = useState<Juego[]>(productosIniciales);
  const maxPrecio = Math.max(...listaProductos.map(p => p.precio));
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, maxPrecio]);

  const todasPlataformas = [...new Set(listaProductos.flatMap(p => p.plataformas))];

  const aplicarFiltros = useCallback(() => {
    const nombre = nombreBusqueda.toLowerCase();
    const [minPrecio, maxPrecio] = rangoPrecio;

    const filtrados = listaProductos.filter(producto => {
      const coincideNombre = producto.nombre.toLowerCase().includes(nombre);
      const coincidePrecio = producto.precio >= minPrecio && producto.precio <= maxPrecio;
      const coincidePlataforma = plataformasSeleccionadas.length === 0
        || producto.plataformas.some(p => plataformasSeleccionadas.includes(p));

      return coincideNombre && coincidePrecio && coincidePlataforma;
    });

    onFiltrar(filtrados);
  }, [nombreBusqueda, rangoPrecio, plataformasSeleccionadas, listaProductos, onFiltrar]);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  const handleCambioRangoPrecio = (valor: number | number[]) => {
    if (Array.isArray(valor)) {
      setRangoPrecio([valor[0], valor[1]]);
    }
  };

  const handleCambioPlataforma = (e: ChangeEvent<HTMLInputElement>) => {
    const plataforma = e.target.value;
    const marcada = e.target.checked;

    setPlataformasSeleccionadas(prev =>
      marcada ? [...prev, plataforma] : prev.filter(p => p !== plataforma)
    );
  };

  return (
    <div className="col-md-3 filtro-lateral bg-dark p-3 shadow-sm">
      <h5 className="mb-3">Filtrar por Precio</h5>

      <Slider
        range
        min={0}
        max={maxPrecio}
        value={rangoPrecio}
        onChange={handleCambioRangoPrecio}
        trackStyle={[{ backgroundColor: "red" }]}
        handleStyle={[
          { borderColor: "red", backgroundColor: "red" },
          { borderColor: "red", backgroundColor: "red" },
        ]}
      />

      <div className="d-flex justify-content-between mt-2 text-white">
        <span>Min: S/ {rangoPrecio[0].toFixed(2)}</span>
        <span>Max: S/ {rangoPrecio[1].toFixed(2)}</span>
      </div>

      <h5 className="mt-4 mb-2">Filtrar por Plataforma</h5>
      <div className="d-flex flex-column text-white">
        {todasPlataformas.map(plataforma => (
          <div key={plataforma} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`chk-${plataforma}`}
              value={plataforma}
              onChange={handleCambioPlataforma}
              checked={plataformasSeleccionadas.includes(plataforma)}
            />
            <label className="form-check-label" htmlFor={`chk-${plataforma}`}>
              {plataforma}
            </label>
          </div>
        ))}
      </div>

      <button
        className="btn btn-secondary w-100 mt-3"
        onClick={() => setMostrarFiltroLateral(false)}
      >
        Cerrar Filtro
      </button>
    </div>
  );
}

export default Filtro;
