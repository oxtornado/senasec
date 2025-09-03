import { useState } from 'react';
import { Monitor, Tv, DoorOpen, X, AlertCircle, CheckCircle, Clock, Wrench, List, Grid3X3 } from 'lucide-react';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { useLanguage } from '../contexts/LanguageContext';

const Inventory = () => {
  const { t } = useLanguage();
  const { equipment } = useEquipment();
  const { isMobile, isTablet } = useBreakpoints();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedTV, setSelectedTV] = useState<boolean>(false);
  const [reportText, setReportText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Obtener el TV del contexto
  const tvData = equipment.find(eq => eq.type === 'televisor') || {
    brand: 'Samsung',
    model: 'Smart TV 55" 4K',
    serialNumber: 'SM017TV'
  };
  
  // Usar equipos del contexto (solo computadores)
  const equipmentData = equipment.filter(eq => eq.type === 'computador' && eq.position > 0);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-500 hover:bg-green-600';
      case 'en_uso': return 'bg-blue-500 hover:bg-blue-600';
      case 'mantenimiento': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'dañado': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible': return <CheckCircle className="h-4 w-4" />;
      case 'en_uso': return <Clock className="h-4 w-4" />;
      case 'mantenimiento': return <Wrench className="h-4 w-4" />;
      case 'dañado': return <AlertCircle className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponible': return t('available');
      case 'en_uso': return t('inUse');
      case 'mantenimiento': return t('maintenance');
      case 'dañado': return t('damaged');
      default: return t('unknown');
    }
  };
  
  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };
  
  const handleReportSubmit = () => {
    if (reportText.trim()) {
      // Aquí se enviaría el reporte al backend
      alert(`Reporte enviado: ${reportText}`);
      setReportText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {t('environmentsSystemsClassroom')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('equipmentDistributionStatus')}
              </p>
            </div>
          </div>
          
          {/* View Mode Toggle - Hidden on mobile if grid view is problematic */}
          {!isMobile && (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>{t('schema')}</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
                <span>{t('list')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leyenda de Estados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('statusLegend')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('available')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('inUse')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('maintenance')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('damaged')}</span>
          </div>
        </div>
      </div>

      {/* Vista de Equipos - Condicional según dispositivo y modo */}
      {(isMobile || viewMode === 'list') ? (
        /* Vista Lista para Móviles */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('equipmentList')}</h3>
          
          {/* TV */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <button
              onClick={() => setSelectedTV(true)}
              className="w-full flex items-center justify-between min-h-touch"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Tv className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">{t('classroomTV')}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tvData.brand} - {tvData.model}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                {t('available')}
              </div>
            </button>
          </div>

          {/* Lista de Computadores */}
          <div className="space-y-3">
            {equipmentData.sort((a, b) => a.position - b.position).map((equipment) => (
              <div key={equipment.position} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleEquipmentClick(equipment)}
                  className="w-full flex items-center justify-between min-h-touch"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      equipment.status === 'disponible' ? 'bg-green-100 dark:bg-green-900' :
                      equipment.status === 'en_uso' ? 'bg-blue-100 dark:bg-blue-900' :
                      equipment.status === 'mantenimiento' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-red-100 dark:bg-red-900'
                    }`}>
                      {getStatusIcon(equipment.status)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white">{t('equipment')} #{equipment.position}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{equipment.brand} - {equipment.model}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{equipment.serialNumber}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    equipment.status === 'disponible' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    equipment.status === 'en_uso' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    equipment.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getStatusText(equipment.status)}
                  </div>
                </button>
                
                {/* Accesorios rápidos en vista móvil */}
                {equipment.accessories && (
                  <div className="mt-3 flex space-x-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      equipment.accessories.screen ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <Monitor className="h-3 w-3" />
                      <span>Pantalla</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      equipment.accessories.keyboard ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <span>⌨️</span>
                      <span>Teclado</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      equipment.accessories.mouse ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <span>🖱️</span>
                      <span>Mouse</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Vista Esquemática Original para Desktop */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('classroomDistribution')}</h3>

          {/* Grid del Aula */}
          <div className="relative bg-gray-50 dark:bg-gray-700 p-8 rounded-lg" style={{ minHeight: '500px' }}>
            {/* Fila Superior */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {[6, 5, 4].map((pos) => {
                const equipment = equipmentData.find(eq => eq.position === pos);
                return (
                  <button
                    key={pos}
                    onClick={() => equipment && handleEquipmentClick(equipment)}
                    className={`w-16 h-16 rounded-lg text-white font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      equipment ? getStatusColor(equipment.status) : 'bg-gray-400'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}

              {/* Puerta */}
              <div className="w-20 h-16 bg-yellow-400 rounded-lg flex items-center justify-center ml-8">
                <DoorOpen className="h-8 w-8 text-yellow-800" />
                <span className="text-xs font-bold text-yellow-800 ml-1">{t('door')}</span>
              </div>

              {[3, 2, 1].map((pos) => {
                const equipment = equipmentData.find(eq => eq.position === pos);
                return (
                  <button
                    key={pos}
                    onClick={() => equipment && handleEquipmentClick(equipment)}
                    className={`w-16 h-16 rounded-lg text-white font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      equipment ? getStatusColor(equipment.status) : 'bg-gray-400'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>

            {/* Columna Izquierda - Acercada más al centro */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
              {[7, 8].map((pos) => {
                const equipment = equipmentData.find(eq => eq.position === pos);
                return (
                  <button
                    key={pos}
                    onClick={() => equipment && handleEquipmentClick(equipment)}
                    className={`w-16 h-16 rounded-lg text-white font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      equipment ? getStatusColor(equipment.status) : 'bg-gray-400'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>

            {/* Área Central - Espacio libre */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-16 border-2 border-gray-300 dark:border-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('freeArea')}</span>
              </div>
            </div>

            {/* Fila Inferior */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {[9, 10, 11, 12, 13, 14, 15, 16].map((pos) => {
                const equipment = equipmentData.find(eq => eq.position === pos);
                return (
                  <button
                    key={pos}
                    onClick={() => equipment && handleEquipmentClick(equipment)}
                    className={`w-16 h-16 rounded-lg text-white font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      equipment ? getStatusColor(equipment.status) : 'bg-gray-400'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>

            {/* TV - Separado más del grupo de equipos */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setSelectedTV(true)}
                className="w-24 h-12 bg-green-400 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:bg-green-500"
              >
                <Tv className="h-6 w-6 text-green-800" />
                <span className="text-xs font-bold text-green-800 ml-1">TV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cuadro de Diálogo para Reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('registerIncident')}
        </h3>
        <div className="space-y-4">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-h-touch"
            placeholder={t('incidentPlaceholder')}
          />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reportText.length}/500 {t('characters')}
            </span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => {
                  alert(t('noIncidentRegistered'));
                  setReportText('');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-touch"
              >
                {t('noIncident')}
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-touch"
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Información del Equipo */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('equipment')} #{selectedEquipment.position}
              </h3>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-h-touch"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Estado */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedEquipment.status)}
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  selectedEquipment.status === 'disponible' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  selectedEquipment.status === 'en_uso' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  selectedEquipment.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {getStatusText(selectedEquipment.status)}
                </span>
              </div>

              {/* Información del Equipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('brand')}</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEquipment.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('model')}</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEquipment.model}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('serialNumber')}</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{selectedEquipment.serialNumber}</p>
                </div>
              </div>

              {/* Accesorios */}
              {selectedEquipment.accessories && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('accessories')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      selectedEquipment.accessories.screen ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <Monitor className="h-3 w-3" />
                      <span>Pantalla</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      selectedEquipment.accessories.keyboard ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <span>⌨️</span>
                      <span>Teclado</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                      selectedEquipment.accessories.mouse ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <span>🖱️</span>
                      <span>Mouse</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información del TV */}
      {selectedTV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('classroomTV')}
              </h3>
              <button
                onClick={() => setSelectedTV(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 min-h-touch"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información del TV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('brand')}</label>
                  <p className="text-sm text-gray-900 dark:text-white">{tvData.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('model')}</label>
                  <p className="text-sm text-gray-900 dark:text-white">{tvData.model}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('serialNumber')}</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{tvData.serialNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;