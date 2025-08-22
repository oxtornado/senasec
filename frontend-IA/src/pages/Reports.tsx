import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports, Report } from '../contexts/ReportsContext';
import { useAssignments } from '../contexts/AssignmentsContext';
import ReportModal from '../components/ReportModal';

const Reports = () => {
  const { t } = useLanguage();
  const { reports, deleteReport, exportReports } = useReports();
  const { assignments } = useAssignments();
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filtrar reportes
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.officialName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterCriteria === '' || 
        report.environmentName.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        report.status.toLowerCase().includes(filterCriteria.toLowerCase());
      const matchesDateRange = (!dateRange.start || report.date >= dateRange.start) &&
        (!dateRange.end || report.date <= dateRange.end);
      const matchesStatus = statusFilter === '' || report.status === statusFilter;
      
      return matchesSearch && matchesFilter && matchesDateRange && matchesStatus;
    });
  }, [reports, searchTerm, filterCriteria, dateRange, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completo':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pendiente':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Revisado':
        return <XCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleDelete = (report: Report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      deleteReport(selectedReport.id);
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
  };

  const handleExport = () => {
    exportReports(filteredReports);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('reportsDashboard')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestión y seguimiento de reportes de funcionarios
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear reporte
            </button>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda por funcionario */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por funcionario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro general */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por ambiente o estado..."
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="Completo">Completo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
          </select>

          {/* Rango de fechas */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Tabla de reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  No. Programación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Funcionario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hora Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hora Salida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ambiente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{report.programmingNumber.toString().padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {report.officialName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(report.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {report.entryTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {report.exitTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {report.environmentName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(report.status)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(report)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report)}
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

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay reportes
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron reportes que coincidan con los criterios de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <ReportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />
      
      <ReportModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        report={selectedReport}
        mode="edit"
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 mr-3">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirmar eliminación
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              <strong>Advertencia:</strong> ¿Quiere borrar este reporte?
              <br />
              <span className="text-sm">
                Reporte #{selectedReport.programmingNumber} - {selectedReport.officialName}
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
