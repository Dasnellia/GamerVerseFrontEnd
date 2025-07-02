import { useState, useEffect } from 'react'; // Importa useEffect y useState
import NavBarra from "../BarraNavAdmin"; // Asumo que esta es la ruta correcta a tu NavBarra de admin
// Las importaciones de imágenes de usuario ya no son necesarias si las fotos vienen de la DB
// import Gaming from '../../../imagenes/Usuarios/Gaming.png';
// import Mualani from '../../../imagenes/Usuarios/Mualani.jpg';
// import Navia from '../../../imagenes/Usuarios/Navia.jpg';

import '../../../css/ListaUser.css'; // Asegúrate de que esta ruta sea correcta

// Define la interfaz para los datos de usuario que esperas del backend.
// Esta interfaz se ha actualizado para coincidir con tus campos: id, usuario, correo, imagen.
// Sin embargo, tu backend devuelve UsuarioID, Nombre, Correo, Foto, Admin, Verificado.
// Es crucial que esta interfaz refleje EXACTAMENTE lo que el backend envía.
// Si tu backend envía 'UsuarioID' y 'Nombre', deberías usar esos.
// Para que coincida con tu backend actual (según el controlador anterior):
interface User {
  UsuarioID: number; // Corresponde a 'id' en tu interfaz deseada
  Nombre: string;    // Corresponde a 'usuario' en tu interfaz deseada
  Correo: string;
  Foto: string | null; // Corresponde a 'imagen' en tu interfaz deseada
  Admin: boolean;
  Verificado: boolean;
}

const MainContent = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]); // Estado para almacenar la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        // Establece loading a true al inicio de la carga
        setLoading(true);
        setError(null); // Limpia cualquier error previo

        // --- Configuración de Headers para Autenticación ---
        // ¡IMPORTANTE!: Reemplaza 'TU_TOKEN_JWT_DE_ADMIN_AQUI' con un token JWT real de administrador.
        // Este token debe obtenerse de tu endpoint de login del backend.
        // Si estás usando el middleware temporal en index.ts que asigna req.user,
        // este token sigue siendo necesario si tu middleware de autenticación REAL está activo.
        // Si el middleware temporal está anulando la autenticación real, puedes poner cualquier cosa aquí
        // o dejarlo vacío por ahora, pero lo correcto es un token válido.
        const tokenAdmin = localStorage.getItem('adminToken'); // Ejemplo: si guardas el token en localStorage
        // O si lo obtienes de un contexto de autenticación, etc.

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Si tienes un token, añádelo a la cabecera Authorization
        if (tokenAdmin) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${tokenAdmin}`;
        } else {
          // Si no hay token, y la ruta requiere autenticación, la solicitud fallará.
          // Puedes mostrar un mensaje al usuario o redirigir a login.
          console.warn("No se encontró token de administrador. La solicitud podría fallar.");
          // O para pruebas con el middleware temporal en index.ts que asigna req.user:
          // No necesitas un token real si ese middleware está activo y asigna un rol 'ADMIN'.
        }

        // Realiza la solicitud fetch a tu endpoint de listado de usuarios
        // Asegúrate de que la URL '/api/admin/users' coincida con la que montaste en index.ts
        const response = await fetch('http://localhost:3001/api/admin/users', { headers });

        if (!response.ok) {
          // Si la respuesta no es OK (ej. 403 Forbidden, 401 Unauthorized, 500 Internal Server Error)
          const errorData = await response.json();
          throw new Error(errorData.msg || `Error al cargar usuarios: ${response.status}`);
        }

        const data: User[] = await response.json();
        setUsuarios(data); // Actualiza el estado con los usuarios obtenidos
      } catch (err: any) {
        console.error("Fallo al cargar la lista de usuarios:", err);
        setError(err.message || "No se pudo cargar la lista de usuarios."); // Guarda el mensaje de error
      } finally {
        setLoading(false); // Finaliza la carga, ya sea éxito o error
      }
    };

    cargarUsuarios(); // Llama a la función para cargar los usuarios cuando el componente se monta
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center">
          <p>Cargando usuarios...</p>
          {/* Puedes añadir un spinner de carga aquí */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container-fluid px-4 py-3 text-center text-danger">
          <p>Error: {error}</p>
          <p>Asegúrate de que el servidor esté corriendo y tengas un token de administrador válido.</p>
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
                      <th>Usuario</th> {/* Ahora usa 'Usuario' como título de columna */}
                      <th>Correo</th>
                      <th>Admin</th> {/* Añadido el estado Admin */}
                      <th>Verificado</th> {/* Añadido el estado Verificado */}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">No hay usuarios registrados.</td>
                      </tr>
                    ) : (
                      usuarios.map(user => (
                        <tr key={user.UsuarioID}> {/* Usa UsuarioID como key */}
                          <td>{user.UsuarioID}</td>
                          <td>
                            {/* Usa user.Foto si existe, de lo contrario un placeholder */}
                            <img
                              src={user.Foto || 'https://placehold.co/50x50/cccccc/000000?text=No+Foto'}
                              alt={user.Nombre} // Usa user.Nombre como alt text
                              className="user-photo"
                            />
                          </td>
                          <td>{user.Nombre}</td> {/* Muestra el Nombre como 'Usuario' */}
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
      <div className="sidebar"> {/* Si NavBarra es el sidebar, este div es correcto */}
        <NavBarra />
      </div>
      <div className="content flex-grow-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default ListadoUsuarios;
