import { useState } from 'react';
import { Monitor, Tv, DoorOpen, X, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';

const Inventory = () => {
  const { equipment, getEquipmentByPosition } = useEquipment();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedTV, setSelectedTV] = useState<boolean>(false);
  const [reportText, setReportText] = useState('');
  
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
      case 'Disponible': return 'bg-green-500 hover:bg-green-600';
      case 'En Uso': return 'bg-blue-500 hover:bg-blue-600';
      case 'Mantenimiento': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Dañado': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponible': return <CheckCircle className="h-4 w-4" />;
      case 'En Uso': return <Clock className="h-4 w-4" />;
      case 'Mantenimiento': return <Wrench className="h-4 w-4" />;
      case 'Dañado': return <AlertCircle className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'en_uso': return 'En Uso';
      case 'mantenimiento': return 'Mantenimiento';
      case 'dañado': return 'Dañado';
      default: return 'Desconocido';
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ambientes – Aula de Sistemas 1
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Distribución y estado de equipos en el aula
            </p>
          </div>
        </div>
      </div>

      {/* Leyenda de Estados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Leyenda de Estados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">En Uso</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Mantenimiento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Dañado</span>
          </div>
        </div>
      </div>

      {/* Gráfico Esquemático del Aula */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución del Aula</h3>

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
              <span className="text-xs font-bold text-yellow-800 ml-1">PUERTA</span>
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
              <span className="text-gray-500 dark:text-gray-400 text-sm">Área Libre</span>
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

      {/* Cuadro de Diálogo para Reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Registre aquí la novedad
        </h3>
        <div className="space-y-4">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Registra si hay alguna novedad con algún equipo, daños o pérdidas. Máx. 500 caracteres"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reportText.length}/500 caracteres
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  alert('Aula sin novedad registrada correctamente');
                  setReportText('');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Aula S/N
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Información del Equipo */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Equipo #{selectedEquipment.position}
              </h3>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEquipment.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEquipment.model}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Serie</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedEquipment.serialNumber}</p>
                </div>
              </div>

              {/* Accesorios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accesorios</label>
                <div className="grid grid-cols-3 gap-2">
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
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información del TV */}
      {selectedTV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Televisor del Aula
              </h3>
              <button
                onClick={() => setSelectedTV(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información del TV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                  <p className="text-sm text-gray-900 dark:text-white">{tvData.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
                  <p className="text-sm text-gray-900 dark:text-white">{tvData.model}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Serie</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{tvData.serialNumber}</p>
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