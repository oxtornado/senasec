import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';
import { Search, Edit, Monitor, Tv, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAuthHeaders } from '../services/equipments';
import { getCurrentUser } from '../services/auth';

export default function EquipmentDashboard() {
  const { t } = useLanguage();
  const { equipment, updateEquipment } = useEquipment();
  console.log("equipment from context:", equipment);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ambientes, setAmbientes] = useState<any[]>([]); // Puedes tipar mejor si tienes el modelo

  const [formData, setFormData] = useState<Partial<Equipment>>({
    posicion: '',
    numero_serie: '',
    tipo: 'computador',
    pulgadas: '',
    caracteristicas: '',
    estado: 'disponible',
    ambiente: undefined
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

  // Filtrar equipos
  const filteredEquipment = equipment.filter(eq => {
  const numeroSerie = eq.numero_serie?.toLowerCase() || '';
  const caracteristicas = eq.caracteristicas?.toLowerCase() || '';
  const tipo = eq.tipo?.toLowerCase() || '';
  const estado = eq.estado?.toLowerCase() || '';
  const term = searchTerm.toLowerCase();

  return (
    numeroSerie.includes(term) || 
    caracteristicas.includes(term) ||
    tipo.includes(term) ||
    estado.includes(term)
  );
});


  const getStatusColor = (status: Equipment['estado']) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'dañado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: Equipment['tipo']) => {
    switch (type) {
      case 'computador': return <Monitor className="h-4 w-4" />;
      case 'televisor': return <Tv className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  // Funciones para manejar los modales
  const resetForm = () => {
    setFormData({
      numero_serie: '',
      tipo: 'computador',
      pulgadas: '',
      caracteristicas: '',
      estado: 'disponible',
    });
  };


  const handleEditEquipment = (equipment: Equipment) => {
    setFormData({
      posicion: equipment.posicion.toString(),
      numero_serie: equipment.numero_serie,
      tipo: equipment.tipo,
      pulgadas: equipment.pulgadas,
      caracteristicas: equipment.caracteristicas,
      estado: equipment.estado,
    });
    setSelectedEquipment(equipment);
    setIsEditing(true);
    setIsModalOpen(true);
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
      posicion: Number(formData.posicion),
      numero_serie: (formData.numero_serie || '').trim(),
      tipo: formData.tipo || 'computador',
      pulgadas: formData.pulgadas,
      caracteristicas: (formData.caracteristicas || '').trim(),
      estado: formData.estado || 'disponible',
      ambiente: formData.ambiente,
      // última_actualización la pone el backend automáticamente
    };

    console.log('Enviando equipo:', equipmentData); // 👀 usa esto para confirmar

    if (isEditing && selectedEquipment) {
      updateEquipment(selectedEquipment.id, equipmentData);
    }

    closeModal();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('equipmentDashboard')}
        </h1>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1">
          {/* Búsqueda general */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por número de serie, tipo, estado o características..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  No. Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pulgadas
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
                    {eq.posicion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {eq.numero_serie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(eq.tipo)}
                      <span className="capitalize">{eq.tipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {eq.pulgadas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(eq.estado)}`}>
                      {eq.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {eq.ultima_actualizacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center mr-6">
                      <button
                        onClick={() => handleEditEquipment(eq)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar equipo"
                      >
                        <Edit className="h-4 w-4" />
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
                  value={formData.posicion}
                  onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: 1, 2, 3... (0 para TV)"
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
                  value={formData.numero_serie}
                  onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Número de serie único"
                  required
                />
              </div>

              {/* Tipo de equipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Equipo
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Equipment['tipo'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="computador">Computador</option>
                  <option value="televisor">Televisor</option>
                </select>
              </div>

              {/* Pulgadas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pulgadas
                </label>
                <input
                  type="text"
                  value={formData.pulgadas}
                  onChange={(e) => setFormData({ ...formData, pulgadas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: HP, Dell, Lenovo"
                  required
                />
              </div>

              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Características
                </label>
                <textarea
                  value={formData.caracteristicas}
                  onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Especificaciones técnicas, accesorios, etc."
                  rows={3}
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as Equipment['estado'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="disponible">Disponible</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="dañado">Dañado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ambiente
                </label>
                <select
                  value={formData.ambiente || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, ambiente: Number(e.target.value) })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="" disabled>
                    Selecciona un ambiente
                  </option>
                  {ambientes.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.nombre}
                    </option>
                  ))}
                </select>
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
    </div>
  );
}
