import { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Plus, X, User, Camera } from 'lucide-react';
import { getCurrentUser } from '../services/auth';

interface UserData {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  password?: string;
  facialImage?: string;
}

const Users = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    id: 0,
    fullName: '',
    email: '',
    role: '',
    phone: '',
    password: '',
    facialImage: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response.data || response;
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Si hay error, asumimos que no hay usuario autenticado
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Datos de ejemplo de usuarios
  const [users, setUsers] = useState<UserData[]>([
    { id: 1, fullName: 'Jorge Orlando Castro', email: 'jorge.castro@senasec.edu.co', role: 'Instructor', phone: '3001234567', facialImage: '' },
    { id: 2, fullName: 'Esteban Hernández', email: 'esteban.hernandez@senasec.edu.co', role: 'Instructor', phone: '3009876543', facialImage: '' },
    { id: 3, fullName: 'José Morales', email: 'jose.morales@senasec.edu.co', role: 'Seguridad', phone: '3005551234', facialImage: '' },
    { id: 4, fullName: 'Dora Velásquez', email: 'dora.velasquez@senasec.edu.co', role: 'Aseo', phone: '3007778888', facialImage: '' },
    { id: 5, fullName: 'Julián Camacho', email: 'julian.camacho@senasec.edu.co', role: 'Administrador', phone: '3002223333', facialImage: '' },
    { id: 6, fullName: 'María González', email: 'maria.gonzalez@senasec.edu.co', role: 'Inventarios', phone: '3004445555', facialImage: '' }
  ]);

  const roles = ['Administrador', 'Instructor', 'Seguridad', 'Aseo', 'Inventarios'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Esta sección solo está disponible para administradores.
          </p>
        </div>
      </div>
    );
  }

  // Filtrar usuarios
  const filteredUsers = users.filter(userData => {
    const matchesSearch = userData.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || userData.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      id: 0,
      fullName: '',
      email: '',
      role: '',
      phone: '',
      password: '',
      facialImage: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (userData: UserData) => {
    setIsEditing(true);
    setSelectedUser(userData);
    setFormData({ ...userData, password: '' });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userData: UserData) => {
    setUserToDelete(userData);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedUser) {
      // Actualizar usuario existente
      setUsers(users.map(u => u.id === selectedUser.id ? { ...formData, id: selectedUser.id } : u));
      alert('Usuario actualizado correctamente');
    } else {
      // Crear nuevo usuario
      const newUser = { ...formData, id: Math.max(...users.map(u => u.id)) + 1 };
      setUsers([...users, newUser]);
      alert('Usuario creado correctamente');
    }
    
    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administrar usuarios del sistema SENASEC
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar usuarios por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtros y botón crear */}
          <div className="flex items-center space-x-4">
            {/* Filtro por rol */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="todos">Todos los roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Botón crear usuario */}
            <button
              onClick={handleCreateUser}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Usuario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nombres y Apellidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.role === 'Administrador' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      userData.role === 'Instructor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      userData.role === 'Seguridad' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      userData.role === 'Aseo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(userData)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron usuarios que coincidan con los criterios de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ingrese nombre completo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ingrese correo electrónico"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione rol</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ingrese número de teléfono"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isEditing ? 'Ingrese nueva contraseña' : 'Ingrese contraseña'}
                  required={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Captura facial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Captura facial
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Aquí se manejaría la carga de la imagen
                        handleInputChange('facialImage', file.name);
                      }
                    }}
                    className="hidden"
                    id="facial-image"
                  />
                  <label
                    htmlFor="facial-image"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Suba o capture imagen facial</span>
                  </label>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isEditing 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                      : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                  }`}
                >
                  {isEditing ? 'Actualizar' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ADVERTENCIA
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Está a punto de borrar un usuario. Esta acción no se puede deshacer.
              </p>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <strong>Usuario a eliminar:</strong><br />
                {userToDelete.fullName}
              </div>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={cancelDeleteUser}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Borrar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
