import { useState } from 'react';
import { useAssignments } from '../contexts/AssignmentsContext';
import { Clock, Users, Calendar, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Loans = () => {
  // Obtener datos del contexto de asignaciones
  const { t } = useLanguage();
  const { schedules } = useAssignments();
  
  // Estado para manejar la semana actual
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Función para obtener el número de semana del año
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  // Función para obtener las fechas de la semana actual
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 6; i++) { // Solo lunes a sábado
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDate);
    }
    return weekDates;
  };
  
  // Función para navegar entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };
  
  // Obtener datos de la semana actual
  const weekNumber = getWeekNumber(currentWeek);
  const weekDates = getWeekDates(currentWeek);
  const currentYear = currentWeek.getFullYear();
  const isCurrentWeek = getWeekNumber(new Date()) === weekNumber && new Date().getFullYear() === currentYear;

  // Franjas horarias específicas por hora
  const timeSlots = [
    // Jornada Mañana
    { time: '07:00 - 08:00', label: '07:00 - 08:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    { time: '08:00 - 09:00', label: '08:00 - 09:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    { time: '09:00 - 10:00', label: '09:00 - 10:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    { time: '10:00 - 11:00', label: '10:00 - 11:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    { time: '11:00 - 12:00', label: '11:00 - 12:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    { time: '12:00 - 13:00', label: '12:00 - 13:00', icon: '🌅', gradient: 'from-blue-500 to-blue-600' },
    // Horario de Aseo
    { time: '13:00 - 13:30', label: t('cleaningTime'), icon: '🧹', gradient: 'from-amber-500 to-orange-500' },
    // Jornada Tarde
    { time: '13:30 - 14:30', label: '13:30 - 14:30', icon: '☀️', gradient: 'from-green-500 to-green-600' },
    { time: '14:30 - 15:30', label: '14:30 - 15:30', icon: '☀️', gradient: 'from-green-500 to-green-600' },
    { time: '15:30 - 16:30', label: '15:30 - 16:30', icon: '☀️', gradient: 'from-green-500 to-green-600' },
    { time: '16:30 - 17:30', label: '16:30 - 17:30', icon: '☀️', gradient: 'from-green-500 to-green-600' },
    { time: '17:30 - 18:00', label: '17:30 - 18:00', icon: '☀️', gradient: 'from-green-500 to-green-600' },
    // Jornada Noche
    { time: '18:00 - 19:00', label: '18:00 - 19:00', icon: '🌙', gradient: 'from-purple-500 to-purple-600' },
    { time: '19:00 - 20:00', label: '19:00 - 20:00', icon: '🌙', gradient: 'from-purple-500 to-purple-600' },
    { time: '20:00 - 21:00', label: '20:00 - 21:00', icon: '🌙', gradient: 'from-purple-500 to-purple-600' },
    { time: '21:00 - 22:00', label: '21:00 - 22:00', icon: '🌙', gradient: 'from-purple-500 to-purple-600' }
  ];
  
  const days = [
    { name: t('monday'), short: t('mon'), color: 'from-slate-600 to-slate-700' },
    { name: t('tuesday'), short: t('tue'), color: 'from-gray-600 to-slate-600' },
    { name: t('wednesday'), short: t('wed'), color: 'from-zinc-600 to-gray-600' },
    { name: t('thursday'), short: t('thu'), color: 'from-stone-600 to-zinc-600' },
    { name: t('friday'), short: t('fri'), color: 'from-neutral-600 to-stone-600' },
    { name: t('saturday'), short: t('sat'), color: 'from-gray-700 to-slate-700' }
  ];
  
  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    const { language } = useLanguage();
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  // Función para obtener información de la clase en una jornada y día específico
  const getClassForSlot = (dayName: string, timeSlot: string) => {
    // Verificar si es horario de aseo
    if (timeSlot === '13:00 - 13:30') {
      return {
        subject: t('cleaningCollaborator'),
        teacher: '',
        code: t('systemsClassrooms'),
        type: 'aseo'
      };
    }

    // Buscar asignación para este día y jornada
    const assignment = schedules.find(schedule => {
      // Verificar si el día coincide
      const dayMatches = (
        (schedule.assignmentDates === 'Lunes a Viernes' && 
         ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'].includes(dayName.toLowerCase())) ||
        schedule.assignmentDates.toLowerCase().includes(dayName.toLowerCase())
      );
      
      if (!dayMatches) return false;
      
      // Verificar si la jornada coincide exactamente
      return schedule.schedule === timeSlot;
    });

    if (assignment) {
      return {
        subject: `FICHA ${assignment.ficha}`,
        teacher: assignment.instructorName.toUpperCase(),
        code: assignment.classroom,
        type: 'instructor'
      };
    }

    return null;
  };

  // Función para obtener el estilo de la celda con diseño mejorado
  const getCellStyle = (classInfo: any, timeSlot: any) => {
    if (!classInfo) {
      return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300';
    }

    if (classInfo.type === 'aseo') {
      return `bg-gradient-to-br ${timeSlot.gradient} text-white font-semibold border-2 border-amber-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`;
    }

    return 'bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold border-2 border-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header mejorado */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl opacity-10"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('schedulesDashboard')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('realTimeScheduleSystem')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('synchronized')}</span>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                isCurrentWeek 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <span className={`text-sm font-medium ${
                  isCurrentWeek 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {isCurrentWeek ? t('currentWeek') : `${t('week')} ${weekNumber}`}
                </span>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {t('year')} {currentYear}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda mejorada */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          {t('statusLegend')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
            <div className="w-6 h-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg shadow-lg"></div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{t('assignedInstructor')}</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-xl">
            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg"></div>
            <span className="font-medium text-amber-700 dark:text-amber-300">{t('cleaningTime')}</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg shadow-lg"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{t('available')}</span>
          </div>
        </div>
      </div>

      {/* Tabla de horarios mejorada */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="h-6 w-6 mr-3" />
              {t('weeklySchedule')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <div className="text-sm opacity-90">{t('week')} {weekNumber} {t('of')} {currentYear}</div>
                <div className="text-xs opacity-75">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[5])}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                  title={t('previousWeek')}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => setCurrentWeek(new Date())}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    isCurrentWeek 
                      ? 'bg-white/30 text-white cursor-default' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  disabled={isCurrentWeek}
                  title={t('goToCurrentWeek')}
                >
                  {t('today')}
                </button>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                  title={t('nextWeek')}
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full table-fixed" style={{minWidth: '1600px'}}>
            {/* Encabezado */}
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <th className="w-52 px-4 py-4 text-left font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>JORNADA</span>
                  </div>
                </th>
                {days.map((day, index) => {
                  const dayDate = weekDates[index];
                  const isToday = dayDate && new Date().toDateString() === dayDate.toDateString();
                  return (
                    <th key={day.name} className="w-44 px-2 py-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      <div className={`bg-gradient-to-r ${
                        isToday 
                          ? 'from-green-500 to-green-600 ring-2 ring-green-300' 
                          : day.color
                      } text-white px-2 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300`}>
                        <div className="font-bold text-sm">{day.short}</div>
                        <div className="text-xs opacity-90">{day.name}</div>
                        {dayDate && (
                          <div className="text-xs opacity-80 mt-1 font-medium">
                            {formatDate(dayDate)}
                          </div>
                        )}
                        {isToday && (
                          <div className="text-xs opacity-90 font-bold">
                            HOY
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            {/* Cuerpo */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.time} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <td className="w-52 px-4 py-6 border-r border-gray-200 dark:border-gray-700">
                    <div className={`bg-gradient-to-r ${timeSlot.gradient} text-white p-3 rounded-xl shadow-lg`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{timeSlot.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{timeSlot.label}</div>
                          <div className="text-xs opacity-90">{timeSlot.time}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  {days.map((day) => {
                    const classInfo = getClassForSlot(day.name, timeSlot.time);
                    return (
                      <td key={`${day.name}-${timeSlot.time}`} className="w-44 px-2 py-6 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                        <div className={`min-h-[80px] rounded-xl p-3 ${getCellStyle(classInfo, timeSlot)} flex flex-col justify-center`}>
                          {classInfo ? (
                            <div className="space-y-1">
                              <div className="font-bold text-xs">{classInfo.subject}</div>
                              {classInfo.teacher && (
                                <div className="text-xs opacity-90 flex items-center justify-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {classInfo.teacher}
                                </div>
                              )}
                              <div className="text-xs opacity-80">{classInfo.code}</div>
                            </div>
                          ) : (
                            <div className="text-xs font-medium">DISPONIBLE</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen mejorado */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Users className="h-6 w-6 mr-3 text-blue-600" />
          Resumen de Asignaciones Activas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-800 dark:via-gray-800 dark:to-zinc-800 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{schedule.instructorName}</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">Instructor</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ficha:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{schedule.ficha}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Horario:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{schedule.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Días:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{schedule.assignmentDates}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No hay asignaciones activas</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Las asignaciones aparecerán aquí cuando se creen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loans;
