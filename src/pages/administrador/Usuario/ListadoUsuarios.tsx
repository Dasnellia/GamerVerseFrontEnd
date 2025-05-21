import NavBarra from "../BarraNavAdmin";
import Gaming from '../../../imagenes/Usuarios/Gaming.png';
import Mualani from '../../../imagenes/Usuarios/Mualani.jpg';
import Navia from '../../../imagenes/Usuarios/Navia.jpg';

import '../../../css/ListaUser.css';

interface User {
  id: number;
  nickname: string;
  name: string;
  imagen: string; 
}

const usuarios: User[] = [
  { id: 1, nickname: 'Gaming', name: 'Yip Gaming', imagen: Gaming },
  { id: 2, nickname: 'Mualani', name: 'Mualani Umoja', imagen: Mualani },
  { id: 3, nickname: 'Navia', name: 'Navia Caspar', imagen: Navia },
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
                      <th>Alias </th>
                      <th>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td><img src={user.imagen} alt={user.name} className="user-photo" /></td>
                        <td>{user.nickname}</td>
                        <td>{user.name}</td>
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