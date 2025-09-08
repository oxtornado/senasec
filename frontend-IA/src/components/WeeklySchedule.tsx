import React, { useState, useMemo } from 'react';
import { useAssignments } from '../contexts/AssignmentsContext';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeSlot {
  start: string;
  end: string;
  label: string;
  isCleaningTime?: boolean;
}

interface ScheduleItem {
  id: number;
  instructorName: string;
  ficha: string;
  classroom: string;
  type: 'instructor' | 'aseo';
  timeSlot: string;
}

const WeeklySchedule: React.FC = () => {
  const { schedules } = useAssignments();
  const { isMobile } = useBreakpoints();
  const { t } = useLanguage();
  
  // Debug logs
  console.log('WeeklySchedule - Total schedules:', schedules.length);
  console.log('WeeklySchedule - Schedules data:', schedules);
  
  const [selectedFilters, setSelectedFilters] = useState({
    classroom: '',
    instructor: '',
    shift: ''
  });

  // Definir franjas horarias según especificaciones
  const timeSlots: TimeSlot[] = [
    // Jornada Mañana (07:00 – 13:00)
    { start: '07:00', end: '08:00', label: '07:00 - 08:00' },
    { start: '08:00', end: '09:00', label: '08:00 - 09:00' },
    { start: '09:00', end: '10:00', label: '09:00 - 10:00' },
    { start: '10:00', end: '11:00', label: '10:00 - 11:00' },
    { start: '11:00', end: '12:00', label: '11:00 - 12:00' },
    { start: '12:00', end: '13:00', label: '12:00 - 13:00' },
    // Horario de Aseo (fijo)
    { start: '13:00', end: '13:30', label: '13:00 - 13:30', isCleaningTime: true },
    // Jornada Tarde (13:30 – 18:00)
    { start: '13:30', end: '14:30', label: '13:30 - 14:30' },
    { start: '14:30', end: '15:30', label: '14:30 - 15:30' },
    { start: '15:30', end: '16:30', label: '15:30 - 16:30' },
    { start: '16:30', end: '17:30', label: '16:30 - 17:30' },
    { start: '17:30', end: '18:00', label: '17:30 - 18:00' },
    // Jornada Noche (18:00 – 22:00)
    { start: '18:00', end: '19:00', label: '18:00 - 19:00' },
    { start: '19:00', end: '20:00', label: '19:00 - 20:00' },
    { start: '20:00', end: '21:00', label: '20:00 - 21:00' },
    { start: '21:00', end: '22:00', label: '21:00 - 22:00' }
  ];

  const weekDays = [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday')];

  // Función para obtener el color de la jornada
  const getShiftColor = (timeSlot: TimeSlot, type: 'instructor' | 'aseo') => {
    if (timeSlot.isCleaningTime || type === 'aseo') {
      return 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200';
    }

    const hour = parseInt(timeSlot.start.split(':')[0]);
    
    if (hour >= 7 && hour < 13) {
      // Jornada Mañana - Azul
      return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200';
    } else if (hour >= 13 && hour < 18) {
      // Jornada Tarde - Verde
      return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
    } else {
      // Jornada Noche - Púrpura
      return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200';
    }
  };

  // Función para verificar si un horario se superpone con una franja
  const isScheduleInTimeSlot = (schedule: string, timeSlot: TimeSlot): boolean => {
    const [scheduleStart, scheduleEnd] = schedule.split(' - ');
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const scheduleStartMinutes = parseTime(scheduleStart);
    const scheduleEndMinutes = parseTime(scheduleEnd);
    const slotStartMinutes = parseTime(timeSlot.start);
    const slotEndMinutes = parseTime(timeSlot.end);

    // Verificar si hay superposición
    return scheduleStartMinutes < slotEndMinutes && scheduleEndMinutes > slotStartMinutes;
  };

  // Obtener asignaciones para una franja horaria específica y día
  const getScheduleForTimeSlot = (timeSlot: TimeSlot, day: string): ScheduleItem[] => {
    return schedules
      .filter(schedule => {
        // Filtrar por día - manejar correctamente "Lunes a Viernes"
        const spanishDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const dayIndex = weekDays.indexOf(day);
        const spanishDay = spanishDays[dayIndex];
        const matchesDay = schedule.assignmentDates === 'Lunes a Viernes' || 
                          schedule.assignmentDates.includes(spanishDay);
        
        // Verificar si el horario se superpone con la franja
        const matchesTimeSlot = isScheduleInTimeSlot(schedule.schedule, timeSlot);
        
        // Aplicar filtros
        const matchesFilters = 
          (!selectedFilters.classroom || schedule.classroom.includes(selectedFilters.classroom)) &&
          (!selectedFilters.instructor || schedule.instructorName.includes(selectedFilters.instructor)) &&
          (!selectedFilters.shift || getShiftFromTimeSlot(timeSlot) === selectedFilters.shift);

        return matchesDay && matchesTimeSlot && matchesFilters;
      })
      .map(schedule => ({
        id: schedule.id,
        instructorName: schedule.instructorName,
        ficha: schedule.ficha,
        classroom: schedule.classroom,
        type: schedule.type,
        timeSlot: timeSlot.label
      }));
  };

  // Función para obtener la jornada de una franja horaria
  const getShiftFromTimeSlot = (timeSlot: TimeSlot): string => {
    if (timeSlot.isCleaningTime) return 'aseo';
    
    const hour = parseInt(timeSlot.start.split(':')[0]);
    if (hour >= 7 && hour < 13) return 'mañana';
    if (hour >= 13 && hour < 18) return 'tarde';
    return 'noche';
  };

  // Obtener opciones únicas para filtros
  const filterOptions = useMemo(() => {
    const classrooms = [...new Set(schedules.map(s => s.classroom))];
    const instructors = [...new Set(schedules.map(s => s.instructorName))];
    const shifts = ['mañana', 'tarde', 'noche', 'aseo'];
    
    return { classrooms, instructors, shifts };
  }, [schedules]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📅 {t('weeklyScheduleByTimeSlots')}
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg mb-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {t('totalSchedulesLoaded')}: {schedules.length}
          </p>
        </div>
        
        {/* Filtros */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-4'} mb-4`}>
          <select
            value={selectedFilters.classroom}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, classroom: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{t('allClassrooms')}</option>
            {filterOptions.classrooms.map(classroom => (
              <option key={classroom} value={classroom}>{classroom}</option>
            ))}
          </select>
          
          <select
            value={selectedFilters.instructor}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, instructor: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{t('allInstructors')}</option>
            {filterOptions.instructors.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
          
          <select
            value={selectedFilters.shift}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, shift: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{t('allShifts')}</option>
            <option value="mañana">{t('morningShift')}</option>
            <option value="tarde">{t('afternoonShift')}</option>
            <option value="noche">{t('nightShift')}</option>
            <option value="aseo">{t('cleaningTime')}</option>
          </select>
        </div>
      </div>

      {/* Calendario de programación */}
      <div className="overflow-x-auto">
        <div className={`min-w-full ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {/* Header con días de la semana */}
          <div className={`grid grid-cols-6 gap-2 mb-2 ${isMobile ? 'min-w-[600px]' : ''}`}>
            <div className={`${isMobile ? 'p-2' : 'p-3'} font-semibold text-gray-700 dark:text-gray-300`}>
              Horario
            </div>
            {weekDays.map(day => (
              <div key={day} className={`${isMobile ? 'p-2' : 'p-3'} font-semibold text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md`}>
                {isMobile ? day.substring(0, 3) : day}
              </div>
            ))}
          </div>

          {/* Filas de franjas horarias */}
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className={`grid grid-cols-6 gap-2 mb-2 ${isMobile ? 'min-w-[600px]' : ''}`}>
              {/* Columna de horario */}
              <div className={`${isMobile ? 'p-2' : 'p-3'} flex items-center justify-center font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md ${timeSlot.isCleaningTime ? 'bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300' : ''}`}>
                <span className={isMobile ? 'text-xs' : 'text-sm'}>
                  {timeSlot.isCleaningTime ? t('cleaningTime') : timeSlot.label}
                </span>
              </div>

              {/* Columnas de días */}
              {weekDays.map(day => {
                const daySchedules = getScheduleForTimeSlot(timeSlot, day);
                
                return (
                  <div key={day} className={`${isMobile ? 'min-h-[60px] p-1' : 'min-h-[80px] p-2'} border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700`}>
                    {daySchedules.length > 0 ? (
                      <div className="space-y-1">
                        {daySchedules.map(item => (
                          <div
                            key={`${item.id}-${day}`}
                            className={`${isMobile ? 'p-1' : 'p-2'} rounded-md border-2 ${getShiftColor(timeSlot, item.type)} transition-all hover:shadow-md cursor-pointer`}
                          >
                            <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
                              {item.type === 'aseo' ? t('cleaning').toUpperCase() : item.instructorName}
                            </div>
                            {!isMobile && (
                              <>
                                <div className="text-xs opacity-75 truncate">
                                  {item.ficha}
                                </div>
                                <div className="text-xs opacity-75 truncate">
                                  {item.classroom}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <span className={isMobile ? 'text-xs' : 'text-sm'}>{t('free')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('legend')}</h3>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-4'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('morningShift')} (07:00-13:00)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('cleaningTime')} (13:00-13:30)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('afternoonShift')} (13:30-18:00)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('nightShift')} (18:00-22:00)
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">{t('morningShift')}</div>
          <div className="text-blue-800 dark:text-blue-200 text-lg font-bold">
            {schedules.filter(s => {
              const hour = parseInt(s.schedule.split(':')[0]);
              return hour >= 7 && hour < 13 && s.type === 'instructor';
            }).length}
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">{t('afternoonShift')}</div>
          <div className="text-green-800 dark:text-green-200 text-lg font-bold">
            {schedules.filter(s => {
              const hour = parseInt(s.schedule.split(':')[0]);
              return hour >= 13 && hour < 18 && s.type === 'instructor';
            }).length}
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">{t('nightShift')}</div>
          <div className="text-purple-800 dark:text-purple-200 text-lg font-bold">
            {schedules.filter(s => {
              const hour = parseInt(s.schedule.split(':')[0]);
              return hour >= 18 && s.type === 'instructor';
            }).length}
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">{t('cleaningSchedules')}</div>
          <div className="text-orange-800 dark:text-orange-200 text-lg font-bold">
            {schedules.filter(s => s.type === 'aseo').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;