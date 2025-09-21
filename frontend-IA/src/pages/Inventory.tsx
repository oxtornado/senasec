import { useState, useEffect } from 'react';
import { Monitor, Tv, DoorOpen, X, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { useLanguage } from '../contexts/LanguageContext';
import { createNovelty } from '../services/novelty';
import { useAmbiente } from '../contexts/EnvironmentContext';
import { fetchAmbientes, Ambiente } from '../services/ambientes';

const Inventory = () => {
  const { t } = useLanguage();
  const { equipment } = useEquipment();
  const { isMobile, isTablet } = useBreakpoints();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedTV, setSelectedTV] = useState<boolean>(false);
  const [reportText, setReportText] = useState('');
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const { ambiente, setAmbiente } = useAmbiente(); // Desde el contexto

  useEffect(() => {
    const loadAmbientes = async () => {
      try {
        const data = await fetchAmbientes();
        setAmbientes(data);
      } catch (err) {
        console.error('Error cargando ambientes:', err);
      }
    };
    loadAmbientes();
  }, []);

  const handleReportSubmit = async () => {
    if (!ambiente) {
      alert('Debe seleccionar un ambiente');
      return;
    }

    try {
      await createNovelty({
        descripcion: reportText.trim(),
        ambiente: ambiente.id,
      });

      setReportText('');
    } catch (error) {
      alert('Error al registrar la novedad');
    }
  };
  
  // Obtener el TV del contexto
  const tvData = equipment.find(eq => eq.tipo === 'televisor') || {
    numero_serie: String(),
    pulgadas: String(),
    caracteristicas: String(),
    ultima_actualizacion: String(),
  };
  
  // Usar equipos del contexto (solo computadores)
  const equipmentData = equipment.filter(eq => eq.tipo === 'computador' && eq.posicion > 0);
  
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'mantenimiento': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'dañado': return 'bg-red-500 hover:bg-red-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };
  
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'disponible': return <CheckCircle className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 dark:text-white" />;
      case 'mantenimiento': return <Wrench className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 dark:text-white" />;
      case 'dañado': return <AlertCircle className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 dark:text-white" />;
      default: return <Monitor className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 dark:text-white" />;
    }
  };
  
  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'mantenimiento': return 'Mantenimiento';
      case 'dañado': return 'Dañado';
      default: return 'Desconocido';
    }
  };
  
  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('environmentTitle')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('environmentDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda de Estados */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3"> {t('environmentLeyendStatus')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('environmentAvailableStatus')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('environmentMaintenenaceStatus')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('environmentDamaged')}</span>
          </div>
        </div>
      </div>

      {/* Gráfico Esquemático del Aula */}
      <div className="hidden md:block border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('environmentClassroomDistribution')}</h3>

        {/* Grid del Aula */}
        <div className="relative bg-gray-50 dark:bg-gray-700 p-8 rounded-lg" style={{ minHeight: '500px' }}>
          {/* Fila Superior */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {[6, 5, 4].map((pos) => {
              const equipment = equipmentData.find(eq => eq.posicion === pos);
              return (
                <button
                  key={pos}
                  onClick={() => equipment && handleEquipmentClick(equipment)}
                  className={`w-16 h-16 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                    equipment ? getStatusColor(equipment.estado) : 'bg-gray-400 text-white'
                  }`}
                >
                  {pos}
                </button>
              );
            })}

            {/* Puerta */}
            <div className="w-20 h-16 bg-yellow-800 rounded-lg flex items-center justify-center ml-8">
              <DoorOpen className="h-8 w-8 text-white" />
              <span className="text-xs font-bold text-white ml-1">{t('environmentDistributionDoor')}</span>
            </div>

            {[3, 2, 1].map((pos) => {
              const equipment = equipmentData.find(eq => eq.posicion === pos);
              return (
                <button
                  key={pos}
                  onClick={() => equipment && handleEquipmentClick(equipment)}
                  className={`w-16 h-16 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                    equipment ? getStatusColor(equipment.estado) : 'bg-gray-400 text-white'
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
              const equipment = equipmentData.find(eq => eq.posicion === pos);
              return (
                <button
                  key={pos}
                  onClick={() => equipment && handleEquipmentClick(equipment)}
                  className={`w-16 h-16 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                    equipment ? getStatusColor(equipment.estado) : 'bg-gray-400 text-white'
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
              <span className="text-gray-500 dark:text-gray-400 text-sm">{t('environmentDistributionFreeArea')}</span>
            </div>
          </div>

          {/* Fila Inferior */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {[9, 10, 11, 12, 13, 14, 15, 16].map((pos) => {
              const equipment = equipmentData.find(eq => eq.posicion === pos);
              return (
                <button
                  key={pos}
                  onClick={() => equipment && handleEquipmentClick(equipment)}
                  className={`w-16 h-16 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                    equipment ? getStatusColor(equipment.estado) : 'bg-gray-400 text-white'
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

      {/* Versión móvil/tablet: Lista scrollable */}
      <div className="block md:hidden bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('environmentClassroomEquipment')}</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-4">{t('environmentpositionEquipment')}</th>
                <th className="px-4 py-2">{t('environmentSerialEquipment')}</th>
                <th className="px-4 py-2">{t('environmentTypeEquipment')}</th>
                <th className="px-4 py-2">{t('environmentStatusEquipment')}</th>
              </tr>
            </thead>
            <tbody className='border-x border-gray-300 dark:border-gray-500'>
              {equipmentData.map((eq) => (
                <tr
                  key={eq.posicion}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleEquipmentClick(eq)}
                >
                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">{eq.posicion}</td>
                  <td className="px-4 py-2 font-mono">{eq.numero_serie}</td>
                  <td className="capitalize px-4 py-2 font-semibold">{eq.tipo}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      eq.estado === 'disponible' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      eq.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {getStatusText(eq.estado)}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Fila para el TV */}
              <tr
                key="tv"
                className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedTV(true)}
              >
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">0</td>
                <td className="px-4 py-2 font-mono">TUVWZ29402</td>
                <td className="px-4 py-2 capitalize font-semibold">Televisor</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Disponible
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Cuadro de Diálogo para Reportes */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('environmentRegisterNovelty')}
        </h3>

        {/* Select de ambiente */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t('environmentOfEnvironment')}</label>
          <select
            value={ambiente?.id || ''}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedAmbiente = ambientes.find(a => a.id === selectedId);
              if (selectedAmbiente) {
                setAmbiente(selectedAmbiente);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('environmentSelectEnvironment')}</option>
            {ambientes.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('environmentInputEnvironment')}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reportText.length}/500 caracteres
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleReportSubmit}
                disabled={!reportText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t('environmentSubmitReport')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Información del Equipo */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-6 md:p-10 lg:py-10 max-w-md w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                Equipo #{selectedEquipment.posicion}
              </h3>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Estado */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedEquipment.estado)}
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  selectedEquipment.estado === 'disponible' ? 'bg-green-100 text-green-800 border border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-none' :
                  selectedEquipment.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 border border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-none' :
                  'bg-red-100 text-red-800 border border-red-400 dark:bg-red-900 dark:text-red-200 dark:border-none'
                }`}>
                  {getStatusText(selectedEquipment.estado)}
                </span>
              </div>

              {/* Información del Equipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentNoSerial')}✅</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{selectedEquipment.numero_serie}</p>
                </div>
                <div>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentSize')}</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{selectedEquipment.pulgadas}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentCharacteristics')} 🧐</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white font-mono">{selectedEquipment.caracteristicas}</p>
                </div>
                <div className='col-span-2'>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentlastupdate')}🔵 </label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{selectedEquipment.ultima_actualizacion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información del TV */}
      {selectedTV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-6 md:p-10 lg:py-10 max-w-md w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                Televisor del Aula
              </h3>
              <button
                onClick={() => setSelectedTV(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información del TV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentNoSerial')} ✅</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{tvData.numero_serie}</p>
                </div>
                <div>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentSize')}</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{tvData.pulgadas}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentCharacteristics')} 🧐</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white font-mono">{tvData.caracteristicas}</p>
                </div>
                <div>
                  <label className="block text-sm lg:text-xl font-medium text-gray-700 dark:text-gray-300">{t('environmentlastupdate')}🔵</label>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white">{tvData.ultima_actualizacion}</p>
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