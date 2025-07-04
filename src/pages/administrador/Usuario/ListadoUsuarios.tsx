// src/components/ListadoUsuarios.tsx
import { useState, useEffect } from 'react';
import NavBarra from "../BarraNavAdmin"; 
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import '../../../css/ListaUser.css'; 

interface User {
  UsuarioID: number;
  Nombre: string; 
  Correo: string;
  Foto: string | null; 
  Admin: boolean; // Aunque el backend puede devolver 'tipo', esta interfaz espera 'Admin'
  Verificado: boolean;
}

const MainContent = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const cargarUsuarios = async () => {
      // *** CAMBIO CLAVE AQUÍ: Usamos 'userToken' ***
      const token = localStorage.getItem('userToken'); 
      const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

      // C. Verificar si el usuario tiene un token y si es administrador
      if (!token || userRole !== 'admin') {
        setError("Acceso denegado. No tienes permisos de administrador o tu sesión ha expirado. Redirigiendo...");
        localStorage.clear(); // Limpia cualquier dato de sesión si el acceso es denegado
        setTimeout(() => {
          navigate('/IniciarSesion'); // Redirige al login
        }, 3000);
        return; // Detener la ejecución
      }

      try {
        setLoading(true); 
        setError(null); 

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Si existe un token válido (ya verificado arriba), añádelo
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch('http://localhost:3001/api/admin/users', { headers });

        if (!response.ok) {
          // Si el servidor responde 401 o 403, es un problema de autenticación/autorización
          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            setError(errorData.msg || "Acceso no autorizado. Tu sesión puede haber expirado.");
            localStorage.clear(); // Limpia los datos de sesión
            setTimeout(() => {
              navigate('/IniciarSesion'); // Redirige al login
            }, 3000);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.msg || `Error al cargar usuarios: ${response.status} ${response.statusText}`);
          }
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
  }, [navigate]); // Añade 'navigate' a las dependencias

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
          {/* El mensaje de redirección ya está en el estado 'error', no necesita un p aparte */}
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