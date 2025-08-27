import React, { useState, useEffect } from 'react';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';
import { Search, Filter, Edit, Trash2, Plus, Monitor, Tv, Volume2, Projector, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentUser } from '../services/auth';

export default function EquipmentDashboard() {
  const { t } = useLanguage();
  const { equipment, updateEquipment, deleteEquipment, addEquipment } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [serialFilter, setSerialFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    position: '',
    brand: '',
    model: '',
    serialNumber: '',
    status: 'Disponible' as Equipment['status'],
    type: 'computador' as Equipment['type'],
    characteristics: ''
  });

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

  // Filtrar equipos
  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = 
      eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.position.toString().includes(searchTerm) ||
      eq.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSerial = eq.serialNumber.toLowerCase().includes(serialFilter.toLowerCase());
    
    return matchesSearch && matchesSerial;
  });

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'En Uso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Mantenimiento': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Dañado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: Equipment['type']) => {
    switch (type) {
      case 'computador': return <Monitor className="h-4 w-4" />;
      case 'televisor': return <Tv className="h-4 w-4" />;
      case 'videobeam': return <Projector className="h-4 w-4" />;
      case 'sonido': return <Volume2 className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  // Funciones para manejar los modales
  const resetForm = () => {
    setFormData({
      position: '',
      brand: '',
      model: '',
      serialNumber: '',
      status: 'Disponible',
      type: 'computador',
      characteristics: ''
    });
  };

  const handleAddEquipment = () => {
    resetForm();
    setIsEditing(false);
    setSelectedEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setFormData({
      position: equipment.position.toString(),
      brand: equipment.brand,
      model: equipment.model,
      serialNumber: equipment.serialNumber,
      status: equipment.status,
      type: equipment.type,
      characteristics: equipment.characteristics
    });
    setSelectedEquipment(equipment);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedEquipment(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const equipmentData = {
      position: parseInt(formData.position),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      serialNumber: formData.serialNumber.trim(),
      status: formData.status,
      type: formData.type,
      characteristics: formData.characteristics.trim(),
      lastUpdate: new Date().toLocaleDateString('es-ES')
    };

    if (isEditing && selectedEquipment) {
      updateEquipment(selectedEquipment.id, equipmentData);
    } else {
      addEquipment(equipmentData);
    }

    closeModal();
  };

  const confirmDeleteEquipment = () => {
    if (equipmentToDelete) {
      deleteEquipment(equipmentToDelete.id);
      setShowDeleteModal(false);
      setEquipmentToDelete(null);
    }
  };

  const cancelDeleteEquipment = () => {
    setShowDeleteModal(false);
    setEquipmentToDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('equipmentDashboard')}
        </h1>
        <button
          onClick={handleAddEquipment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('add')} Equipo</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda general */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, número o características..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filtro por número de serie */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Filtrar por número de serie..."
              value={serialFilter}
              onChange={(e) => setSerialFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  No. Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Marca Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  No. Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEquipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {eq.position === 0 ? 'TV' : eq.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(eq.type)}
                      <span className="capitalize">{eq.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {eq.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {eq.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                    {eq.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(eq.status)}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {eq.lastUpdate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEquipment(eq)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar equipo"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEquipment(eq)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar equipo"
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

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron equipos que coincidan con los filtros.</p>
          </div>
        )}
      </div>

      {/* Modal de Agregar/Editar Equipo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Número de posición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Equipo
                </label>
                <input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: 1, 2, 3... (0 para TV)"
                  required
                  min="0"
                  max="20"
                />
              </div>

              {/* Tipo de equipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Equipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Equipment['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="computador">Computador</option>
                  <option value="televisor">Televisor</option>
                  <option value="videobeam">Videobeam</option>
                  <option value="sonido">Sonido</option>
                </select>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: HP, Dell, Lenovo"
                  required
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: OptiPlex 3070, Pavilion 15"
                  required
                />
              </div>

              {/* Número de serie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Serie
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Número de serie único"
                  required
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Uso">En Uso</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Dañado">Dañado</option>
                </select>
              </div>

              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Características
                </label>
                <textarea
                  value={formData.characteristics}
                  onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Especificaciones técnicas, accesorios, etc."
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {isEditing ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && equipmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ADVERTENCIA
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Está a punto de eliminar un equipo. Esta acción no se puede deshacer.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {equipmentToDelete.position === 0 ? 'TV' : `Equipo #${equipmentToDelete.position}`} - {equipmentToDelete.brand} {equipmentToDelete.model}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Serie: {equipmentToDelete.serialNumber}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteEquipment}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteEquipment}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar Equipo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
