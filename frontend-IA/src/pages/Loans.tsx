  import { useState } from 'react';
  import { Clock, Users, Calendar, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
  import { useAssignments} from '../contexts/AssignmentsContext';
  import { useLanguage } from '../contexts/LanguageContext';
  import { Eye } from 'lucide-react';




  export default function LoansDashboard() {
    // Obtener datos del contexto de asignaciones
    const { assignments } = useAssignments();
    console.log("🧠 Assignments REALES", JSON.stringify(assignments, null, 2));

    const { t, language } = useLanguage();
    


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
    
    const formatDate = (date: Date, language: string) => {
      const locale = language === 'es' ? 'es-ES' : 'en-US';
      return date.toLocaleDateString(locale, { 
        day: '2-digit', 
        month: '2-digit'
      });
    };

    const renderedSlots = new Set(); // Set con claves únicas tipo "2025-09-15-07:00"


    // Convierte una hora "HH:MM:SS" o "HH:MM" a minutos
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };


    // Función para obtener información de la clase en una jornada y día específico
    const getClassForSlot = (day: Date, timeSlot: string) => {
      const formattedDate = day.toLocaleDateString("sv-SE"); // e.g. "2025-09-15"
      const [startSlot, endSlot] = timeSlot.split(' - ');
      const slotStartMin = timeToMinutes(startSlot);
      const slotEndMin = timeToMinutes(endSlot);

      console.log("🗓 Slot Date:", formattedDate);
      console.log("⏰ Slot Time:", timeSlot, `(${slotStartMin} - ${slotEndMin})`);
      console.log("📝 Total assignments:", assignments.length);

      // Vamos a recorrer todos los assignments del día y ver cuál encaja
      for (const a of assignments) {
        console.log("🎯 Checking assignment:");
        console.log("📅 Dia:", a.dia);
        console.log("🕐 Inicio:", a.hora_inicio, "| Fin:", a.hora_fin);
        
        const assignStartMin = timeToMinutes(a.hora_inicio);
        const assignEndMin = timeToMinutes(a.hora_fin);

        console.log("🧮 Assign mins:", assignStartMin, "-", assignEndMin);

        // Lógica de cruce
        const isSameDate = a.dia === formattedDate;
        const overlaps = assignStartMin < slotEndMin && assignEndMin > slotStartMin;

        console.log("📌 isSameDate:", isSameDate, "| overlaps:", overlaps);

        if (isSameDate && overlaps) {
          console.log("✅ MATCH FOUND!");
          return {
            subject: `${a?.ficha?.numero || 'Sin ficha'}`,
            teacher: a?.usuario?.username || 'Sin instructor',
            code: a?.ambiente?.nombre ? `${a.ambiente.nombre}` : 'Sin ambiente',
            type: 'programacion',
            rol: a?.usuario?.rol || null,
            assignment: a
          };
        }
      }

      console.log("❌ No match found for this slot.");
      return null; // No hay clase asignada en esa franja
    };

    // Función para obtener el estilo de la celda con diseño mejorado
    const getCellStyle = (classInfo: any, timeSlot: any) => {
      if (!classInfo) {
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300';
      }

      if (classInfo.rol === 'aseo') {
        return `bg-gradient-to-br ${timeSlot.gradient} text-white font-semibold border-2 border-amber-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`;
      }

      return 'bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold border-2 border-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
    };

    return (
      <div className="space-y-8 p-6">
        {/* Header mejorado */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl opacity-10"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="flex flex-wrap xl:flex-nowrap items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('schedulesDashboard')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{t('realTimeScheduleSystem')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                {/* <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('synchronized')}</span>
                </div> */}
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
                    {t('programmingYear')} {currentYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda mejorada */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            {t('statusLegend')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-gray-300 dark:to-gray-400 rounded-lg shadow-lg"></div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{t('assignedInstructor')}</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg"></div>
              <span className="font-medium text-amber-700 dark:text-amber-300">{t('cleaningTime')}</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700 rounded-lg shadow-lg"></div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('programmingAvailable')}</span>
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
                    {formatDate(weekDates[0], language)} - {formatDate(weekDates[5], language)}
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
                      <span>{t('journal')}</span>
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
                          <div className="font-bold text-sm">{day.name}</div>
                          {dayDate && (
                            <div className="text-xs opacity-80 mt-1 font-medium">
                              {formatDate(dayDate, language)}
                            </div>
                          )}
                          {isToday && (
                            <div className="text-xs opacity-90 font-bold">
                              {t('today')}
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
                {timeSlots.map((timeSlot, rowIndex) => (
                  <tr key={timeSlot.time} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    {/* Columna de la hora */}
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

                    {days.map((day, dayIndex) => {
                      const dayDate = weekDates[dayIndex];
                      const slotKey = `${dayDate.toISOString().split('T')[0]}-${timeSlot.time}`;

                      if (renderedSlots.has(slotKey)) {
                        return null;
                      }

                      const classInfo = getClassForSlot(dayDate, timeSlot.time);

                      let rowSpan = 1;

                      if (classInfo) {
                        const startMin = timeToMinutes(classInfo.assignment.hora_inicio);
                        const endMin = timeToMinutes(classInfo.assignment.hora_fin);
                        const duration = endMin - startMin;
                        rowSpan = Math.max(1, duration / 60);

                        // Marcar todos los slots que cubre este assignment
                        for (let i = 0; i < rowSpan; i++) {
                          const nextSlot = timeSlots[rowIndex + i];
                          if (nextSlot) {
                            const coveredKey = `${dayDate.toISOString().split('T')[0]}-${nextSlot.time}`;
                            renderedSlots.add(coveredKey);
                          }
                        }
                      }

                      return (
                        <td
                          key={`${day.name}-${timeSlot.time}`}
                          rowSpan={rowSpan}
                          className="w-44 px-2 py-0 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 align-middle"
                        >
                          <div className="w-full h-full flex">
                            <div
                              style={{ height: `${rowSpan * 80}px` }}
                              className={`relative group flex flex-col justify-center items-center text-center w-full p-3 rounded-xl ${getCellStyle(classInfo, timeSlot)}`}
                            >
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
                                <div className="text-xs font-medium">{t('programmingStatus')}</div>
                              )}

                              {/* Botón ojito on-hover */}
                              <button
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 dark:bg-gray-800 p-1 rounded-full shadow-lg hover:scale-110 transform"
                              title={t('viewDetails')}
                              onClick={() => window.location.href = '/LoginAula'} // ✅ redirección nativa
                            >
                              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                            </button>

                            </div>
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
      </div>
    );
  };