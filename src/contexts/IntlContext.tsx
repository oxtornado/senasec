import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mensajes de traducción organizados
const messages = {
  es: {
    // Navegación
    'nav.dashboard': 'Dashboard',
    'nav.environments': 'Ambientes',
    'nav.schedules': 'Programaciones',
    'nav.reports': 'Reportes',
    'nav.assignments': 'Asignaciones',
    'nav.equipment': 'Equipos',
    'nav.users': 'Usuarios',
    'nav.logout': 'Cerrar Sesión',
    'nav.menu': 'Menú',
    'nav.language': 'Idioma',
    'nav.theme': 'Tema',
    
    // Días de la semana
    'days.monday': 'Lunes',
    'days.tuesday': 'Martes',
    'days.wednesday': 'Miércoles',
    'days.thursday': 'Jueves',
    'days.friday': 'Viernes',
    'days.saturday': 'Sábado',
    'days.mon': 'LUN',
    'days.tue': 'MAR',
    'days.wed': 'MIÉ',
    'days.thu': 'JUE',
    'days.fri': 'VIE',
    'days.sat': 'SÁB',
    
    // Dashboard stats
    'stats.totalElements': 'Total de Elementos',
    'stats.availableElements': 'Elementos Disponibles',
    'stats.myActiveLoans': 'Mis Préstamos Activos',
    'stats.myOverdueLoans': 'Mis Préstamos Vencidos',
    'stats.totalMyLoans': 'Total de Mis Préstamos',
    'stats.attention': 'Atención',
    'stats.upToDate': 'Al día',
    'stats.activeLoans': 'Préstamos Activos',
    'stats.overdueLoans': 'Préstamos Vencidos',
    
    // Usuario
    'user.welcome': 'Bienvenido',
    'user.administrator': 'Administrador',
    'user.standardUser': 'Usuario Estándar',
    'user.admin': 'ADMIN',
    'user.user': 'USUARIO',
    'user.userLoadError': 'Error al cargar la información del usuario',
    
    // Estados
    'status.available': 'Disponible',
    'status.inUse': 'En Uso',
    'status.maintenance': 'Mantenimiento',
    'status.damaged': 'Dañado',
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'status.status': 'Estado',
    
    // Equipos
    'equipment.computer': 'Computador',
    'equipment.tv': 'Televisor',
    'equipment.projector': 'Videobeam',
    'equipment.sound': 'Sonido',
    'equipment.equipment': 'Equipo',
    'equipment.equipmentNumber': 'No. Equipo',
    'equipment.type': 'Tipo',
    'equipment.brand': 'Marca',
    'equipment.model': 'Modelo',
    'equipment.serialNumber': 'Número de Serie',
    'equipment.lastUpdate': 'Última Actualización',
    'equipment.characteristics': 'Características',
    'equipment.accessories': 'Accesorios',
    
    // Botones
    'buttons.add': 'Agregar',
    'buttons.edit': 'Editar',
    'buttons.delete': 'Eliminar',
    'buttons.save': 'Guardar',
    'buttons.cancel': 'Cancelar',
    'buttons.search': 'Buscar',
    'buttons.update': 'Actualizar',
    'buttons.send': 'Enviar',
    
    // Mensajes
    'messages.loading': 'Cargando...',
    'messages.warning': 'ADVERTENCIA',
    'messages.noEquipmentFound': 'No se encontraron equipos que coincidan con los filtros.',
    'messages.noAssignmentsFound': 'No se encontraron asignaciones de instructores que coincidan con los criterios de búsqueda.',
    
    // Acceso
    'access.restrictedAccess': 'Acceso Restringido',
    'access.noPermissions': 'No tienes permisos para acceder a esta página.',
    
    // Landing
    'landing.signIn': 'Iniciar Sesión',
    'landing.smartSecurityForClassrooms': 'Seguridad Inteligente para Aulas',
    'landing.landingDescription': 'Sistema integral de monitoreo y gestión para ambientes educativos con tecnología avanzada y control en tiempo real.',
    'landing.learnMore': 'Conocer Más',
    'landing.ourFeatures': 'Nuestras Características',
    'landing.featuresDescription': 'Descubre las funcionalidades que hacen de SENASEC la mejor opción para la seguridad educativa.',
    
    // Programaciones
    'schedules.realTimeScheduleSystem': 'Sistema de horarios sincronizado en tiempo real',
    'schedules.synchronized': 'SINCRONIZADO',
    'schedules.currentWeek': 'SEMANA ACTUAL',
    'schedules.week': 'SEMANA',
    'schedules.year': 'AÑO',
    'schedules.of': 'de',
    'schedules.cleaningTime': 'Horario de Aseo',
    'schedules.cleaningCollaborator': 'ASEO - COLABORADOR DE TURNO',
    'schedules.weeklySchedule': 'Horario Semanal de Jornadas',
    'schedules.previousWeek': 'Semana anterior',
    'schedules.nextWeek': 'Semana siguiente',
    'schedules.goToCurrentWeek': 'Ir a semana actual',
    'schedules.today': 'HOY',
    'schedules.systemsClassrooms': 'AULAS DE SISTEMAS',
    'schedules.assignedInstructor': 'Instructor Asignado',
    'schedules.statusLegend': 'Leyenda de Estados',
    
    // Asignaciones
    'assignments.instructorAssignments': 'Asignaciones de Instructores',
    'assignments.assignmentManagement': 'Gestión de asignaciones de aulas y horarios para instructores',
    'assignments.searchInstructor': 'Buscar por nombre de instructor...',
    'assignments.assignInstructor': 'Asignar Instructor',
    'assignments.instructor': 'Instructor',
    'assignments.assignmentDates': 'Fechas de Asignación',
    'assignments.assignedGroup': 'Ficha asignada',
    'assignments.editAssignment': 'Editar asignación',
    'assignments.deleteAssignment': 'Eliminar asignación',
    'assignments.confirmDeleteAssignment': '¿Estás seguro de que deseas eliminar esta asignación?',
    'assignments.cleaningTimeError': 'No se puede asignar en el horario de aseo (13:00 - 13:30)',
    'assignments.scheduleConflictError': 'Ya existe una asignación en este horario y aula',
    'assignments.allInstructors': 'Todos los instructores',
    
    // Ambientes
    'environments.environmentsSystemsClassroom': 'Ambientes – Aula de Sistemas 1',
    'environments.equipmentDistributionStatus': 'Distribución y estado de equipos en el aula',
    'environments.schema': 'Esquema',
    'environments.list': 'Lista',
    'environments.equipmentList': 'Lista de Equipos',
    'environments.classroomTV': 'Televisor del Aula',
    'environments.classroomDistribution': 'Distribución del Aula',
    'environments.door': 'PUERTA',
    'environments.freeArea': 'Área Libre',
    'environments.registerIncident': 'Registre aquí la novedad',
    'environments.incidentPlaceholder': 'Registra si hay alguna novedad con algún equipo, daños o pérdidas. Máx. 500 caracteres',
    'environments.characters': 'caracteres',
    'environments.noIncidentRegistered': 'Aula sin novedad registrada correctamente',
    'environments.noIncident': 'Aula S/N',
    'environments.unknown': 'Desconocido',
    'environments.statusLegend': 'Leyenda de Estados',
    
    // Generales
    'general.allRightsReserved': 'Todos los derechos reservados',
    'general.contact': 'Contacto',
    'general.tel': 'Tel',
    'general.dashboard': 'Dashboard',
    'general.actions': 'Acciones'
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.environments': 'Environments',
    'nav.schedules': 'Schedules',
    'nav.reports': 'Reports',
    'nav.assignments': 'Assignments',
    'nav.equipment': 'Equipment',
    'nav.users': 'Users',
    'nav.logout': 'Logout',
    'nav.menu': 'Menu',
    'nav.language': 'Language',
    'nav.theme': 'Theme',
    
    // Days of the week
    'days.monday': 'Monday',
    'days.tuesday': 'Tuesday',
    'days.wednesday': 'Wednesday',
    'days.thursday': 'Thursday',
    'days.friday': 'Friday',
    'days.saturday': 'Saturday',
    'days.mon': 'MON',
    'days.tue': 'TUE',
    'days.wed': 'WED',
    'days.thu': 'THU',
    'days.fri': 'FRI',
    'days.sat': 'SAT',
    
    // Dashboard stats
    'stats.totalElements': 'Total Elements',
    'stats.availableElements': 'Available Elements',
    'stats.myActiveLoans': 'My Active Loans',
    'stats.myOverdueLoans': 'My Overdue Loans',
    'stats.totalMyLoans': 'Total My Loans',
    'stats.attention': 'Attention',
    'stats.upToDate': 'Up to Date',
    'stats.activeLoans': 'Active Loans',
    'stats.overdueLoans': 'Overdue Loans',
    
    // User
    'user.welcome': 'Welcome',
    'user.administrator': 'Administrator',
    'user.standardUser': 'Standard User',
    'user.admin': 'ADMIN',
    'user.user': 'USER',
    'user.userLoadError': 'Error loading user information',
    
    // Status
    'status.available': 'Available',
    'status.inUse': 'In Use',
    'status.maintenance': 'Maintenance',
    'status.damaged': 'Damaged',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.status': 'Status',
    
    // Equipment
    'equipment.computer': 'Computer',
    'equipment.tv': 'TV',
    'equipment.projector': 'Projector',
    'equipment.sound': 'Sound',
    'equipment.equipment': 'Equipment',
    'equipment.equipmentNumber': 'Equipment No.',
    'equipment.type': 'Type',
    'equipment.brand': 'Brand',
    'equipment.model': 'Model',
    'equipment.serialNumber': 'Serial Number',
    'equipment.lastUpdate': 'Last Update',
    'equipment.characteristics': 'Characteristics',
    'equipment.accessories': 'Accessories',
    
    // Buttons
    'buttons.add': 'Add',
    'buttons.edit': 'Edit',
    'buttons.delete': 'Delete',
    'buttons.save': 'Save',
    'buttons.cancel': 'Cancel',
    'buttons.search': 'Search',
    'buttons.update': 'Update',
    'buttons.send': 'Send',
    
    // Messages
    'messages.loading': 'Loading...',
    'messages.warning': 'WARNING',
    'messages.noEquipmentFound': 'No equipment found matching the filters.',
    'messages.noAssignmentsFound': 'No instructor assignments found matching the search criteria.',
    
    // Access
    'access.restrictedAccess': 'Restricted Access',
    'access.noPermissions': 'You do not have permissions to access this page.',
    
    // Landing
    'landing.signIn': 'Sign In',
    'landing.smartSecurityForClassrooms': 'Smart Security for Classrooms',
    'landing.landingDescription': 'Comprehensive monitoring and management system for educational environments with advanced technology and real-time control.',
    'landing.learnMore': 'Learn More',
    'landing.ourFeatures': 'Our Features',
    'landing.featuresDescription': 'Discover the functionalities that make SENASEC the best choice for educational security.',
    
    // Schedules
    'schedules.realTimeScheduleSystem': 'Real-time synchronized schedule system',
    'schedules.synchronized': 'SYNCHRONIZED',
    'schedules.currentWeek': 'CURRENT WEEK',
    'schedules.week': 'WEEK',
    'schedules.year': 'YEAR',
    'schedules.of': 'of',
    'schedules.cleaningTime': 'Cleaning Time',
    'schedules.cleaningCollaborator': 'CLEANING - SHIFT COLLABORATOR',
    'schedules.weeklySchedule': 'Weekly Schedule',
    'schedules.previousWeek': 'Previous week',
    'schedules.nextWeek': 'Next week',
    'schedules.goToCurrentWeek': 'Go to current week',
    'schedules.today': 'TODAY',
    'schedules.systemsClassrooms': 'SYSTEMS CLASSROOMS',
    'schedules.assignedInstructor': 'Assigned Instructor',
    'schedules.statusLegend': 'Status Legend',
    
    // Assignments
    'assignments.instructorAssignments': 'Instructor Assignments',
    'assignments.assignmentManagement': 'Management of classroom and schedule assignments for instructors',
    'assignments.searchInstructor': 'Search by instructor name...',
    'assignments.assignInstructor': 'Assign Instructor',
    'assignments.instructor': 'Instructor',
    'assignments.assignmentDates': 'Assignment Dates',
    'assignments.assignedGroup': 'Assigned group',
    'assignments.editAssignment': 'Edit assignment',
    'assignments.deleteAssignment': 'Delete assignment',
    'assignments.confirmDeleteAssignment': 'Are you sure you want to delete this assignment?',
    'assignments.cleaningTimeError': 'Cannot assign during cleaning time (13:00 - 13:30)',
    'assignments.scheduleConflictError': 'An assignment already exists at this time and classroom',
    'assignments.allInstructors': 'All instructors',
    
    // Environments
    'environments.environmentsSystemsClassroom': 'Environments – Systems Classroom 1',
    'environments.equipmentDistributionStatus': 'Equipment distribution and status in the classroom',
    'environments.schema': 'Schema',
    'environments.list': 'List',
    'environments.equipmentList': 'Equipment List',
    'environments.classroomTV': 'Classroom TV',
    'environments.classroomDistribution': 'Classroom Distribution',
    'environments.door': 'DOOR',
    'environments.freeArea': 'Free Area',
    'environments.registerIncident': 'Register incident here',
    'environments.incidentPlaceholder': 'Register if there is any incident with equipment, damage or losses. Max. 500 characters',
    'environments.characters': 'characters',
    'environments.noIncidentRegistered': 'Classroom without incident registered correctly',
    'environments.noIncident': 'No Incident',
    'environments.unknown': 'Unknown',
    'environments.statusLegend': 'Status Legend',
    
    // General
    'general.allRightsReserved': 'All rights reserved',
    'general.contact': 'Contact',
    'general.tel': 'Tel',
    'general.dashboard': 'Dashboard',
    'general.actions': 'Actions'
  }
};

type Language = 'es' | 'en';

interface IntlContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (id: string, values?: Record<string, any>) => string;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

export const IntlContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>(() => {
    const saved = localStorage.getItem('senasec-locale');
    return (saved as Language) || 'es';
  });

  const setLocale = (newLocale: Language) => {
    console.log('=== REACT-INTL: CAMBIO DE IDIOMA ===');
    console.log('Idioma anterior:', locale);
    console.log('Nuevo idioma:', newLocale);
    
    setLocaleState(newLocale);
    localStorage.setItem('senasec-locale', newLocale);
    
    console.log('Idioma actualizado exitosamente');
  };

  const t = (id: string, values?: Record<string, any>): string => {
    const message = messages[locale]?.[id as keyof typeof messages.es];
    if (!message) {
      console.warn(`Missing translation for key: ${id} in locale: ${locale}`);
      return id;
    }
    
    if (values) {
      return Object.keys(values).reduce((msg, key) => {
        return msg.replace(new RegExp(`{${key}}`, 'g'), String(values[key]));
      }, message);
    }
    
    return message;
  };

  return (
    <IntlContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </IntlContext.Provider>
  );
};

export const useIntlContext = () => {
  const context = useContext(IntlContext);
  if (context === undefined) {
    throw new Error('useIntlContext must be used within an IntlContextProvider');
  }
  return context;
};
