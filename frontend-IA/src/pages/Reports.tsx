import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReportes, Reportes, ReportesInput } from '../contexts/ReportsContext';
import { Assignments } from '../contexts/AssignmentsContext';
import { getAuthHeaders } from '../services/assignments';

export default function ReportesDashboard() {
  const { reportes, createReporte, updateReporte, deleteReporte, exportReportes } = useReportes();
  console.log("reportes from context:", reportes);
  
  const { t } = useLanguage();
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reporteToDelete, setReporteToDelete] = useState<Reportes | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<Reportes | null>(null);
  const [programaciones, setProgramaciones] = useState<Assignments[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const estados = ['completo', 'pendiente', 'revisado'];

  useEffect(() => {
    const fetchProgramaciones = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8001/programaciones/programaciones/mias/', {
          headers: getAuthHeaders(),
        });

        // Solo incluir las programaciones que NO tienen reporte
        const disponibles = res.data.filter((p: any) => !p.tiene_reporte); 
        setProgramaciones(disponibles);
      } catch (error) {
        console.error('Error cargando programaciones:', error);
      }
    };

    fetchProgramaciones();
  }, []);


  const [formData, setFormData] = useState<Partial<ReportesInput>>({
    programacion: 0,
    entrada_usuario: '',
    salida_usuario: '',
    estado: 'pendiente'
  });

  // Funciones para manejar los modales
  const resetForm = () => {
    setFormData({
      programacion: 0,
      entrada_usuario: '',
      salida_usuario: '',
      estado: 'pendiente'
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateReporte = () => {
    resetForm();
    setSelectedReporte(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditReporte = (reporte: Reportes) => {
    setFormData({
      programacion: reporte.programacion,
      entrada_usuario: reporte.entrada_usuario,
      salida_usuario: reporte.salida_usuario,
      estado: reporte.estado
    });
    setSelectedReporte(reporte);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedReporte(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que formData.estado es válido
    if (!formData.estado) {
      alert('Por favor selecciona un estado válido.');
      return;
    }
    
    const reporteData = {
      programacion: formData.programacion || 0,
      entrada_usuario: (formData.entrada_usuario || '').trim(),
      salida_usuario: (formData.salida_usuario || '').trim(),
      estado: formData.estado,
    };

    console.log('Enviando reporte:', reporteData); // 👀 usa esto para confirmar

    if (isEditing && selectedReporte) {
      updateReporte(selectedReporte.id, reporteData);
      setSuccessMessage(t('reportSuccessUpdate'));
    } else {
      createReporte(reporteData);
      setSuccessMessage(t('reportSuccessCreate'));
    }

    closeModal();
    setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
  };

  const handleDeleteReporte = (reporte: Reportes) => {
    setReporteToDelete(reporte);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteReporte = () => {
    if (reporteToDelete) {
      deleteReporte(reporteToDelete.id);
      setShowDeleteModal(false);
      setReporteToDelete(null);
      setSuccessMessage(t('reportSuccessDelete'));
      setTimeout(() => setSuccessMessage(''), 4000); // Limpia después de 4 seg
    }
  };
  
  const cancelDeleteReporte = () => {
    setShowDeleteModal(false);
    setReporteToDelete(null);
  };

  const handleExport = () => {
    exportReportes(filteredReportes);
  };


  // Filtrar reportes
  const filteredReportes = useMemo(() => {
    return reportes.filter(reporte => {
      const matchesSearch = reporte.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || reporte.estado === statusFilter;
      const matchesDateRange = (!dateRange.start || reporte.fecha_reporte >= dateRange.start) &&
        (!dateRange.end || reporte.fecha_reporte <= dateRange.end);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [reportes, searchTerm, dateRange, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completo':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pendiente':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'revisado':
        return <XCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('reportsDashboard')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reportsDescription')}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('reportExportButton')}
            </button>
            <button
              onClick={handleCreateReporte}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('reportCreateButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda por funcionario */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('reportSearchUser')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('reportStatusFilter')}</option>
            <option value="completo">{t('reportStatusComplete')}</option>
            <option value="pendiente">{t('reportStatusPending')}</option>
            <option value="revisado">{t('reportStatusReviewed')}</option>
          </select>

          {/* Rango de fechas */}
          <div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Tabla de reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportProgrammingNumber')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportUser')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportStartHour')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportEndHour')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('reportStatus')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="border border-gray-700 dark:border-gray-500 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReportes.map((reporte) => (
                <tr key={reporte.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{reporte.programacion.toString().padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {reporte.usuario_nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(reporte.fecha_reporte).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {reporte.entrada_usuario}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {reporte.salida_usuario}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(reporte.estado)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReporte(reporte)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReporte(reporte)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

        {filteredReportes.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('reportNotFoundTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('reportNotFoundDescription')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Reporte */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? t('reportUpdate') : t('reportCreate')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PROGRAMACIÓN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reportProgrammingNumber')}
                </label>
                <select
                  value={formData.programacion}
                  onChange={(e) => handleInputChange('programacion', Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('reportProgrammingNumberInput')}</option>
                  {programaciones.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.id.toString().padStart(3, '0')} - {p.usuario.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* HORA DE ENTRADA Y HORA DE SALIDA */}
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('reportStartHour')}
                  </label>
                  <input
                    type="time"
                    value={formData.entrada_usuario}
                    onChange={(e) => handleInputChange('entrada_usuario', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className='flex-1'>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('reportEndHour')}
                  </label>
                  <input
                    type="time"
                    value={formData.salida_usuario}
                    onChange={(e) => handleInputChange('salida_usuario', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* ESTADO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reportStatus')}
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('reportStatusInput')}</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTÓN */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? t('reportUpdate') : t('reportCreateButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && reporteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-center items-center mb-4">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 mr-3">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('reportWarning')}
              </h3>
            </div>

            <p className="flex justify-center text-center text-gray-500 dark:text-gray-400 mb-6">
              {t('reportWarningDescription')}
            </p>

            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <strong>{t('reportWarningAssignment')}</strong><br />
              #{reporteToDelete.programacion}
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDeleteReporte}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {t('reportWarningCancel')}
              </button>
              <button
                onClick={confirmDeleteReporte}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t('reportWarningDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
