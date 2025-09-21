import { useState, useEffect } from 'react';
import { useUser, Users } from '../contexts/UsersContext';
import { Search, Filter, Edit, Trash2, X, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentUser } from '../services/auth';
import FaceCapture from '../components/FaceCapture'; // o la ruta correcta según tu estructura

export default function UsersDashboard() {
  const { users, updateUser, deleteUser } = useUser();
  const { t } = useLanguage();
  console.log("users from context:", users);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const roles = ['admin', 'instructor', 'seguridad', 'aseo', 'inventario'];


  const [formData, setFormData] = useState<Partial<Users>>({
    username: '',
    documento: '',
    email: '',
    telefono: '',
    rol: 'instructor',
    face_token: '',
    password: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (!currentUser || currentUser.rol !== "admin") {
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
  const filteredUsers = users.filter(u => {
  const userName = u.username?.toLowerCase() || '';
  const documento = u.documento?.toLowerCase() || '';
  const email = u.email?.toLowerCase() || '';
  const telefono = u.telefono?.toLowerCase() || '';
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    userName.includes(term) ||
    documento.includes(term) ||
    email.includes(term) ||
    telefono.includes(term);

  const matchesRole =
    roleFilter === 'todos' || u.rol === roleFilter;

  return matchesSearch && matchesRole;
});

  // Funciones para manejar los modales
  const resetForm = () => {
    setFormData({
      username: '',
      documento: '',
      email: '',
      telefono: '',
      rol: 'instructor',
      face_token: '',
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleEditUser = (user: Users) => {
    setFormData({
      username: user.username,
      documento: user.documento,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      face_token: user.face_token,
    });
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      username: (formData.username || '').trim(),
      documento: (formData.documento || '').trim(),
      email: (formData.email || '').trim(),
      telefono: (formData.telefono || '').trim(),
      rol: formData.rol || 'instructor',
      face_token: (formData.face_token || '').trim()
      // última_actualización la pone el backend automáticamente
    };

    console.log('Enviando usuario:', userData); // 👀 usa esto para confirmar

    if (isEditing && selectedUser) {
      updateUser(selectedUser.id, userData);
      setSuccessMessage(t('userSuccessUpdate'));
    }

    closeModal();
    setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
  };

  const handleDeleteUser = (user: Users) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      setSuccessMessage(t('userSuccessDelete'));
      setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const roleLabels: Record<Users['rol'], string> = {
    admin: 'Administrador',
    instructor: 'Instructor',
    seguridad: 'Seguridad',
    aseo: 'Aseo',
    inventario: 'Inventario',
  };

  const roleColors: Record<Users['rol'], string> = {
    admin: 'bg-red-100 text-red-800 border border-red-400 dark:bg-red-900 dark:text-red-200 dark:border-none',
    instructor: 'bg-blue-100 text-blue-800 border border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-none',
    seguridad: 'bg-yellow-100 text-yellow-800 border border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-none',
    aseo: 'bg-green-100 text-green-800 border border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-none',
    inventario: 'bg-purple-100 text-purple-800 border border-purple-400 dark:bg-purple-900 dark:text-purple-200 dark:border-none',
  };


  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 text-center mb-4 p-4 rounded-md bg-green-300 text-black border border-green-500 shadow-sm">
          {successMessage}
        </div>
      )}
      {/* Header */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('usermanagement')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('userManageSENASECsystemusers')}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-x-6 space-y-4 md:space-y-0">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('userSearch')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por rol */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="todos">{t('userAllRoles')}</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userfullname')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userRole')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userActions')}
                </th>
              </tr>
            </thead>
            <tbody className="border border-gray-700 dark:border-gray-500 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.username}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[userData.rol]}`}>
                      {roleLabels[userData.rol]}
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
              {t('userNoUsersWereFoundMatchingSearchCriteria')} 
            </p>
          </div>
        )}
      </div>

      {/* Modal de Editar Usuario */}
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
                  {t('userfullname')}
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Ingrese nombre completo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('useremail')}
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
                  {t('userRole')}
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => handleInputChange('rol', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione rol</option>
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userphone')}
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="Ingrese número de teléfono"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isEditing ? t('usernewpassword') : t('userpassword')}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isEditing ? t('userplaceholdernewpassword') : t('userplaceholderpassword')}
                  required={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Captura facial */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('userFaceCapture')}
                </label>
                <FaceCapture
                  username={formData.username ?? ''}
                  documento={formData.documento ?? ''}
                  rol={formData.rol ?? ''}
                  email={formData.email ?? ''}
                  telefono={formData.telefono ?? ''}
                  password={formData.password ?? ''}
                  isEditing={true} // esto asegura que se use el endpoint de actualización
                />
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
                  {isEditing ? t('userUpdateButton') : t('userCreateButton')}
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
                {t('userWarning')}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('userWarningDescription')}
              </p>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <strong>{t('userToDelete')}:</strong><br />
                {userToDelete.username}
              </div>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={cancelDeleteUser}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {t('userCancel')}
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {t('userDeleteUser')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

