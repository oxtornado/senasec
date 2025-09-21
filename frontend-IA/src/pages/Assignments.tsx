import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, User, Calendar, Clock, X } from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { getAuthHeaders } from '../services/assignments';
import { useAssignments, Assignments, AssignmentsInput } from '../contexts/AssignmentsContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssignmentsDashboard() {
  const { assignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments();
  console.log("assignments from context:", assignments);

  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignments | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignments | null>(null);
  const [users, setUsers] = useState<any[]>([]); // Puedes tipar mejor si tienes el modelo
  const [fichas, setFichas] = useState<any[]>([]); // Puedes tipar mejor si tienes el modelo
  const [ambientes, setAmbientes] = useState<any[]>([]); // Puedes tipar mejor si tienes el modelo
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8001/users/usuarios/', {
          headers: getAuthHeaders(),
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8001/fichas/fichas/', {
          headers: getAuthHeaders(),
        });
        setFichas(res.data);
      } catch (error) {
        console.error('Error cargando fichas:', error);
      }
    };

    fetchFichas();
  }, []);

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8001/ambiente/ambiente/', {
          headers: getAuthHeaders(),
        });
        setAmbientes(res.data);
      } catch (error) {
        console.error('Error cargando ambientes:', error);
      }
    };

    fetchAmbientes();
  }, []);

  const [formData, setFormData] = useState<Partial<AssignmentsInput>>({
    usuario_id: 0,
    ficha_id: 0,
    ambiente_id: 0,
    dia: '',
    hora_inicio: '',
    hora_fin: ''
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user || user.rol !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  // Filtrar asignaciones
  const filteredAssignments = assignments.filter(a => {
  const username = a.usuario.username.toLowerCase() || '';
  const term = searchTerm.toLowerCase();
  return username.includes(term);
});

  // Funciones para manejar los modales
  const resetForm = () => {
    setFormData({
      usuario_id: 0,
      ambiente_id: 0,
      ficha_id: 0,
      dia: '',
      hora_inicio: '',
      hora_fin: ''
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAssignment = () => {
    setFormData({
      usuario_id: 0,
      ficha_id: 0,
      ambiente_id: 0,
      dia: '',
      hora_inicio: '',
      hora_fin: ''
    });
    setSelectedAssignment(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignments) => {
    setFormData({
      usuario_id: assignment.usuario.id,
      ficha_id: assignment.ficha.id,
      ambiente_id: assignment.ambiente.id,
      dia: assignment.dia,
      hora_inicio: assignment.hora_inicio,
      hora_fin: assignment.hora_fin
    });
    setSelectedAssignment(assignment);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedAssignment(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignmentData = {
      usuario_id: formData.usuario_id || 0,
      ambiente_id: formData.ambiente_id || 0,
      ficha_id: formData.ficha_id || 0,
      dia: (formData.dia || '').trim(),
      hora_inicio: (formData.hora_inicio || '').trim(),
      hora_fin: (formData.hora_fin || '').trim(),
    };

    console.log('Enviando programación:', assignmentData); // 👀 usa esto para confirmar

    if (isEditing && selectedAssignment) {
      updateAssignment(selectedAssignment.id, assignmentData);
      setSuccessMessage(t('assignmentSuccessUpdate'));
    } else {
      createAssignment(assignmentData);
      setSuccessMessage(t('assignmentSuccessCreate'));
    }

    closeModal();
    setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
  };

  const handleDeleteAssignment = (assignment: Assignments) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteAssignment = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
      setSuccessMessage(t('assignmentSuccessDelete'));
      setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
    }
  };
  
  const cancelDeleteAssignment = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
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
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('assignmentTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('assignmentDescription')}
            </p>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('assignmentSearch')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleCreateAssignment}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5" />
            <span>{t('assignmentButton')}</span>
          </button>
        </div>
      </div>

      {/* Tabla de asignaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('assignmentUsername')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('assignmentEnvironment')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('assignmentDates')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="border border-gray-700 dark:border-gray-500 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.usuario.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t('assignedGroup')}: {assignment.ficha.numero}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="text-md text-gray-500 dark:text-gray-400 mt-1">
                        {assignment.ambiente.nombre}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {assignment.dia}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {assignment.hora_inicio} - {assignment.hora_fin}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title={t('editAssignment')}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title={t('deleteAssignment')}
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
        
        {filteredAssignments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {t('assignmentNotFound')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Asignación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? t('assignmentUpdate') : t('assignmentCreate')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* INSTRUCTOR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assignmentUser')}
                </label>
                <select
                  value={formData.usuario_id}
                  onChange={(e) => handleInputChange('usuario_id', Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('assignmentSelectedUser')}</option>
                  {users.map(i => (
                    <option key={i.id} value={i.id}>{i.username}</option>
                  ))}
                </select>
              </div>

              {/* FICHA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assignmentGroup')}
                </label>
                <select
                  value={formData.ficha_id}
                  onChange={(e) => handleInputChange('ficha_id', Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('assignmentSelectedGroup')}</option>
                  {fichas.map(f => (
                    <option key={f.id} value={f.id}>{f.numero}</option>
                  ))}
                </select>
              </div>

              {/* AMBIENTE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assignmentEnvironmentInput')}
                </label>
                <select
                  value={formData.ambiente_id}
                  onChange={(e) => handleInputChange('ambiente_id', Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('assignmentSelectedEnvironment')}</option>
                  {ambientes.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>

              {/* DÍA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assignmentDayInput')}
                </label>
                <input
                  type="date"
                  value={formData.dia}
                  onChange={(e) => handleInputChange('dia', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Horario */}
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('assignmentStartHourInput')}
                  </label>
                  <input
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className='flex-1'>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('assignmentEndHourInput')}
                  </label>
                  <input
                    type="time"
                    value={formData.hora_fin}
                    onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* BOTÓN */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? t('assignmentUpdateButton') : t('assignmentCreateButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && assignmentToDelete && (
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
                {t('assignmentWarning')}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('assignmentWarningDescription')}
              </p>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <strong>{t('assignmentWarningAssignment')}</strong><br />
                {assignmentToDelete.usuario.username}
              </div>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={cancelDeleteAssignment}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {t('assignmentWarningCancel')}
                </button>
                <button
                  onClick={confirmDeleteAssignment}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {t('assignmentWarningDelete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};