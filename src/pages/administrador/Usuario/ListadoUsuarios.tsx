import NavBarra from "../BarraNavAdmin";
import Gaming from '../../../imagenes/Usuarios/Gaming.png';
import Mualani from '../../../imagenes/Usuarios/Mualani.jpg';
import Navia from '../../../imagenes/Usuarios/Navia.jpg';

import '../../../css/ListaUser.css';

interface User {
  id: number;
  usuario: string;
  correo: string;
  imagen: string; 
}

const usuarios: User[] = [
  { id: 1, usuario: 'Gaming', correo: 'gamingyp@gmail.com', imagen: Gaming },
  { id: 2, usuario: 'Mualani', correo: 'mualani2@gmail.com', imagen: Mualani },
  { id: 3, usuario: 'Navia', correo: 'navia@gmail.com', imagen: Navia },
];

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="container-fluid px-4 py-3">
        <h1 className="mb-4 display-5">Usuarios</h1>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Foto</th>
                      <th>Usuario </th>
                      <th>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td><img src={user.imagen} alt={user.correo} className="user-photo" /></td>
                        <td>{user.usuario}</td>
                        <td>{user.correo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListadoUsuarios = () => {
  return (
    <div className="d-flex vh-100">
      <div className="sidebar">
        <NavBarra />
      </div>
      <div className="content flex-grow-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default ListadoUsuarios;