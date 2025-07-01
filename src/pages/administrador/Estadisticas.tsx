import React from 'react';
import NavBarra from "./BarraNavAdmin";
import DiagramadeVentas from './VentasDiagrama';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/estadisticas.css';

interface StatCardProps {
  title: string;
  value: string;
  percentage: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="card stat-card h-100 shadow">
      <div className="card-body d-flex flex-column">
        <h3 className="card-title">{title}</h3>
        <div className="display-4 my-3">
          <p>{value}</p>
          </div>
        <div className={`mt-auto fs-5 ${percentage >= 0 ? "text-success" : "text-danger"}`}>
          <i className={percentage >= 0 ? "bi bi-arrow-up" : "bi bi-arrow-down"}></i>
          {Math.abs(percentage)}% vs ayer
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="container-fluid px-4 py-3">
        <h1 className="mb-4 display-5">Dashboard de Ventas</h1>
        
        <div className="row g-4 mb-4">
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
            <StatCard title="Ventas Hoy" value="S/ 4,250" percentage={12} />
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
            <StatCard title="Usuarios registrados" value="0" percentage={0} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="card shadow-lg h-100">
              <div className="card-header">
                <h2 className="m-0">Ventas Mensuales</h2>
              </div>
              <div className="card-bod" >
                <DiagramadeVentas />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Estadisticas = () => {
  return (
    <div className="d-flex vh-100">
      <NavBarra />
      <div className="content flex-grow-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default Estadisticas;
