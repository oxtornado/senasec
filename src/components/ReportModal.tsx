import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Building, FileText, Save } from 'lucide-react';
import { useReports, Report } from '../contexts/ReportsContext';
import { useAssignments } from '../contexts/AssignmentsContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: Report | null;
  mode: 'create' | 'edit';
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report, mode }) => {
  const { addReport, updateReport } = useReports();
  const { assignments } = useAssignments();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    date: '',
    entryTime: '',
    exitTime: '',
    officialName: '',
    officialId: 0,
    environmentId: 0,
    environmentName: '',
    status: 'Pendiente' as 'Completo' | 'Pendiente' | 'Revisado',
    observations: '',
    createdBy: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener funcionarios únicos de las asignaciones
  const officials = assignments.reduce((acc, assignment) => {
    const existing = acc.find(o => o.name === assignment.instructorName);
    if (!existing) {
      acc.push({
        id: assignment.id,
        name: assignment.instructorName,
        environments: [{ id: assignment.id, name: assignment.classroom }]
      });
    } else {
      const envExists = existing.environments.find(e => e.name === assignment.classroom);
      if (!envExists) {
        existing.environments.push({ id: assignment.id, name: assignment.classroom });
      }
    }
    return acc;
  }, [] as Array<{ id: number; name: string; environments: Array<{ id: number; name: string }> }>);

  // Obtener ambientes para el funcionario seleccionado
  const selectedOfficial = officials.find(o => o.id === formData.officialId);
  const availableEnvironments = selectedOfficial?.environments || [];

  // Inicializar formulario
  useEffect(() => {
    if (mode === 'edit' && report) {
      setFormData({
        date: report.date,
        entryTime: report.entryTime,
        exitTime: report.exitTime,
        officialName: report.officialName,
        officialId: report.officialId,
        environmentId: report.environmentId,
        environmentName: report.environmentName,
        status: report.status,
        observations: report.observations || '',
        createdBy: report.createdBy
      });
    } else if (mode === 'create') {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      
      setFormData({
        date: currentDate,
        entryTime: currentTime,
        exitTime: '',
        officialName: '',
        officialId: 0,
        environmentId: 0,
        environmentName: '',
        status: 'Pendiente',
        observations: '',
        createdBy: 'Usuario Actual' // En una app real, obtener del contexto de auth
      });
    }
  }, [mode, report, isOpen]);

  // Auto-completar hora de salida con hora actual
  const fillCurrentExitTime = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({ ...prev, exitTime: currentTime }));
  };

  // Manejar cambio de funcionario
  const handleOfficialChange = (officialId: number) => {
    const official = officials.find(o => o.id === officialId);
    if (official) {
      setFormData(prev => ({
        ...prev,
        officialId,
        officialName: official.name,
        environmentId: 0,
        environmentName: ''
      }));
    }
  };

  // Manejar cambio de ambiente
  const handleEnvironmentChange = (environmentId: number) => {
    const environment = availableEnvironments.find(e => e.id === environmentId);
    if (environment) {
      setFormData(prev => ({
        ...prev,
        environmentId,
        environmentName: environment.name
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (!formData.entryTime) newErrors.entryTime = 'La hora de entrada es requerida';
    if (!formData.exitTime) newErrors.exitTime = 'La hora de salida es requerida';
    if (!formData.officialId) newErrors.officialId = 'Debe seleccionar un funcionario';
    if (!formData.environmentId) newErrors.environmentId = 'Debe seleccionar un ambiente';

    // Validar que la hora de salida sea posterior a la de entrada
    if (formData.entryTime && formData.exitTime) {
      const [entryHour, entryMin] = formData.entryTime.split(':').map(Number);
      const [exitHour, exitMin] = formData.exitTime.split(':').map(Number);
      
      const entryMinutes = entryHour * 60 + entryMin;
      const exitMinutes = exitHour * 60 + exitMin;
      
      // Considerar turnos nocturnos (si la hora de salida es menor, es del día siguiente)
      if (exitMinutes <= entryMinutes && exitHour > 0) {
        // Solo validar si no es un turno nocturno (00:00 - 08:00)
        if (!(exitHour >= 0 && exitHour <= 8 && entryHour >= 16)) {
          newErrors.exitTime = 'La hora de salida debe ser posterior a la de entrada';
        }
      }
    }

    // Validar fecha no futura
    const today = new Date().toISOString().split('T')[0];
    if (formData.date > today) {
      newErrors.date = 'No se pueden crear reportes para fechas futuras';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        addReport(formData);
      } else if (mode === 'edit' && report) {
        updateReport(report.id, formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar reporte:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Crear Nuevo Reporte' : 'Editar Reporte'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fecha y horarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha del reporte *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-1 text-green-500" />
                Hora de entrada *
              </label>
              <input
                type="time"
                value={formData.entryTime}
                onChange={(e) => setFormData(prev => ({ ...prev, entryTime: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.entryTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.entryTime && <p className="text-red-500 text-sm mt-1">{errors.entryTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-1 text-red-500" />
                Hora de salida *
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={formData.exitTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitTime: e.target.value }))}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.exitTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={fillCurrentExitTime}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 text-sm"
                  title="Usar hora actual"
                >
                  Ahora
                </button>
              </div>
              {errors.exitTime && <p className="text-red-500 text-sm mt-1">{errors.exitTime}</p>}
            </div>
          </div>

          {/* Funcionario y ambiente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Funcionario *
              </label>
              <select
                value={formData.officialId}
                onChange={(e) => handleOfficialChange(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.officialId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value={0}>Seleccionar funcionario</option>
                {officials.map(official => (
                  <option key={official.id} value={official.id}>
                    {official.name}
                  </option>
                ))}
              </select>
              {errors.officialId && <p className="text-red-500 text-sm mt-1">{errors.officialId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Ambiente *
              </label>
              <select
                value={formData.environmentId}
                onChange={(e) => handleEnvironmentChange(Number(e.target.value))}
                disabled={!formData.officialId}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.environmentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${!formData.officialId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value={0}>Seleccionar ambiente</option>
                {availableEnvironments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.name}
                  </option>
                ))}
              </select>
              {errors.environmentId && <p className="text-red-500 text-sm mt-1">{errors.environmentId}</p>}
              {!formData.officialId && (
                <p className="text-gray-500 text-sm mt-1">Primero seleccione un funcionario</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado del reporte
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completo">Completo</option>
              <option value="Revisado">Revisado</option>
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              rows={3}
              placeholder="Escriba cualquier observación o comentario sobre el turno..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Reporte' : 'Actualizar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
