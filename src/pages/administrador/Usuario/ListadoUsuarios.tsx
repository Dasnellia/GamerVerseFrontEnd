import { useState, useEffect } from 'react';
import NavBarra from "../BarraNavAdmin"; 

import '../../../css/ListaUser.css'; 

interface User {
  UsuarioID: number;
  Nombre: string; 
  Correo: string;
  Foto: string | null; 
  Admin: boolean;
  Verificado: boolean;
}

const MainContent = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true); 
        setError(null); 

        const tokenAdmin = localStorage.getItem('adminToken'); 

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (tokenAdmin) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${tokenAdmin}`;
        } else {
          console.warn("Advertencia: No se encontró token de administrador. La solicitud podría fallar si la ruta está protegida.");
        }

        const response = await fetch('http://localhost:3001/api/admin/users', { headers });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || `Error al cargar usuarios: ${response.status} ${response.statusText}`);
        }

        const data: User[] = await response.json();
        setUsuarios(data); 
      } catch (err: any) {
        console.error("Fallo al cargar la lista de usuarios:", err);
        setError(err.message || "No se pudo cargar la lista de usuarios."); 
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios(); 
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center">
          <p>Cargando usuarios...</p>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center text-danger">
          <p>Error: {error}</p>
          <p>Asegúrate de que el servidor backend esté corriendo y que el usuario tenga permisos de administrador.</p>
        </div>
      </div>
    );
  }

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
                      <th>Usuario</th> 
                      <th>Correo</th>
                      <th>Admin</th>
                      <th>Verificado</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">No hay usuarios registrados.</td>
                      </tr>
                    ) : (
                      usuarios.map(user => (
                        <tr key={user.UsuarioID}> 
                          <td>{user.UsuarioID}</td>
                          <td>
                            <img
                              src={user.Foto || 'https://placehold.co/50x50/cccccc/000000?text=No+Foto'}
                              alt={user.Nombre} 
                              className="user-photo"
                            />
                          </td>
                          <td>{user.Nombre}</td>
                          <td>{user.Correo}</td>
                          <td>{user.Admin ? 'Sí' : 'No'}</td> 
                          <td>{user.Verificado ? 'Sí' : 'No'}</td>
                        </tr>
                      ))
                    )}
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