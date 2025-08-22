import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, User, Calendar, Clock, X, Filter, AlertTriangle } from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { useAssignments, Assignment } from '../contexts/AssignmentsContext';

const Assignments = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [scheduleError, setScheduleError] = useState('');
  const [formData, setFormData] = useState<Omit<Assignment, 'id' | 'createdAt'>>({
    instructorName: '',
    ficha: '',
    status: 'Inactivo',
    assignmentDates: '',
    schedule: '',
    classroom: ''
  });

  // Usar el contexto de asignaciones
  const { assignments, addAssignment, updateAssignment, deleteAssignment, validateScheduleConflict, isCleaningTime } = useAssignments();

  const uniqueInstructors = [...new Set(assignments.map(a => a.instructorName))];
  const classrooms = ['Aula de Sistemas 1', 'Aula de Sistemas 2', 'Aula de Sistemas 3', 'Aula de Diseño', 'Aula de Redes'];
  // Solo las 3 jornadas completas especificadas
  const scheduleOptions = [
    '07:00 - 13:00',  // Jornada mañana
    '13:30 - 18:00',  // Jornada tarde
    '18:30 - 22:00'   // Jornada noche
  ];
  // Nota: 13:00-13:30 está reservado para aseo y no debe usarse para asignaciones

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
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
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstructor = selectedInstructor === '' || assignment.instructorName === selectedInstructor;
    return matchesSearch && matchesInstructor;
  });

  const handleCreateAssignment = () => {
    setIsEditing(false);
    setSelectedAssignment(null);
    setFormData({
      instructorName: '',
      ficha: '',
      status: 'Inactivo',
      assignmentDates: '',
      schedule: '',
      classroom: ''
    });
    setScheduleError('');
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setIsEditing(true);
    setSelectedAssignment(assignment);
    setFormData({
      instructorName: assignment.instructorName,
      ficha: assignment.ficha,
      status: assignment.status,
      assignmentDates: assignment.assignmentDates,
      schedule: assignment.schedule,
      classroom: assignment.classroom
    });
    setScheduleError('');
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
      deleteAssignment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError('');

    // Validar horario de aseo
    if (isCleaningTime(formData.schedule)) {
      setScheduleError('No se puede asignar en el horario de aseo (13:00 - 13:30)');
      return;
    }

    // Validar conflictos de horario
    if (validateScheduleConflict(formData.schedule, formData.classroom, selectedAssignment?.id)) {
      setScheduleError('Ya existe una asignación en este horario y aula');
      return;
    }

    if (isEditing && selectedAssignment) {
      updateAssignment(selectedAssignment.id, formData);
    } else {
      addAssignment(formData);
    }

    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'schedule' || field === 'classroom') {
      setScheduleError('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Asignaciones de Instructores
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión de asignaciones de aulas y horarios para instructores
            </p>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre de instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Todos los instructores</option>
                {uniqueInstructors.map(instructor => (
                  <option key={instructor} value={instructor}>{instructor}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateAssignment}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Asignar Instructor</span>
          </button>
        </div>
      </div>

      {/* Tabla de asignaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fechas de Asignación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                          {assignment.instructorName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Ficha asignada: {assignment.ficha}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assignment.status === 'Activo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {assignment.assignmentDates}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {assignment.schedule}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {assignment.classroom}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar asignación"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar asignación"
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
              No se encontraron asignaciones de instructores que coincidan con los criterios de búsqueda.
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
                {isEditing ? 'Editar Asignación de Instructor' : 'Asignar Instructor a Aula'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre del instructor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del instructor
                </label>
                <input
                  type="text"
                  value={formData.instructorName}
                  onChange={(e) => handleInputChange('instructorName', e.target.value)}
                  placeholder="Ingrese nombre completo del instructor"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Ficha que imparte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ficha que imparte
                </label>
                <input
                  type="text"
                  value={formData.ficha}
                  onChange={(e) => handleInputChange('ficha', e.target.value)}
                  placeholder="Ingrese código de la ficha que imparte"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Estado de la asignación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado de la asignación
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'Activo' | 'Inactivo')}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Inactivo">Inactivo</option>
                  <option value="Activo">Activo</option>
                </select>
              </div>

              {/* Fecha de asignación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fechas de asignación
                </label>
                <select
                  value={formData.assignmentDates}
                  onChange={(e) => handleInputChange('assignmentDates', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione días de asignación</option>
                  <option value="Lunes a Viernes">Lunes a Viernes</option>
                  <option value="Lunes a Miércoles">Lunes a Miércoles</option>
                  <option value="Jueves a Sábado">Jueves a Sábado</option>
                  <option value="Sábados">Sábados</option>
                  <option value="Domingos">Domingos</option>
                </select>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horario
                </label>
                <select
                  value={formData.schedule}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione horario</option>
                  {scheduleOptions.map(schedule => (
                    <option key={schedule} value={schedule}>{schedule}</option>
                  ))}
                </select>
              </div>

              {/* Aula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aula asignada
                </label>
                <select
                  value={formData.classroom}
                  onChange={(e) => handleInputChange('classroom', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione aula</option>
                  {classrooms.map(classroom => (
                    <option key={classroom} value={classroom}>{classroom}</option>
                  ))}
                </select>
              </div>

              {/* Error de horario */}
              {scheduleError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400">{scheduleError}</span>
                </div>
              )}

              {/* Botón de acción */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
