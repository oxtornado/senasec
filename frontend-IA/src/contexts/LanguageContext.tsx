import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir las traducciones directamente en el contexto
const translations = {
  es: {
    // Navegación
    dashboard: "Dashboard",
    environments: "Ambientes",
    schedules: "Programaciones",
    reports: "Reportes",
    assignments: "Asignaciones",
    equipment: "Equipos",
    users: "Usuarios",
    logout: "Cerrar Sesión",
    menu: "Menú",
    language: "Idioma",
    theme: "Tema",
    allRightsReserved: "Todos los derechos reservados",
    contact: "Contacto",
    
    // Días de la semana
    monday: "Lunes",
    tuesday: "Martes", 
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    today: "HOY",
    
    // Horarios y turnos
    morningShift: "Turno Mañana",
    afternoonShift: "Turno Tarde", 
    nightShift: "Turno Noche",
    cleaningTime: "Tiempo de Aseo",
    allClassrooms: "Todas las aulas",
    allInstructors: "Todos los instructores",
    allShifts: "Todos los turnos",
    free: "Libre",
    legend: "Leyenda",
    journal: "JORNADA",
    currentWeek: "Semana actual",
    programmingYear: "Año",
    realTimeScheduleSystem: "Sistema de programación en tiempo real",
    statusLegend: "Leyenda de estados",
    assignedInstructor: "Instructor asignado",
    programmingAvailable: "Disponible",
    weeklySchedule: "Horario Semanal",
    week: "Semana",
    of: "de",
    programmingStatus: "DISPONIBLE",
    
    // Dashboard stats
    totalElements: "Elementos Totales",
    availableElements: "Elementos Disponibles",
    myActiveLoans: "Mis Préstamos Activos",
    myOverdueLoans: "Mis Préstamos Vencidos",
    totalMyLoans: "Total de Mis Préstamos",
    attention: "Atención",
    upToDate: "Al día",
    welcome: "Bienvenido",
    administrator: "Administrador",
    standardUser: "Usuario Estándar",
    admin: "ADMIN",
    user: "USUARIO",
    
    // Notificaciones
    youHaveOverdueLoans: "Tienes {{count}} préstamo(s) vencido(s)",
    pleaseReturnItems: "Por favor, devuelve los elementos lo antes posible",
    allLoansUpToDate: "¡Todos tus préstamos están al día!",
    excellentLoanManagement: "Excelente gestión de tus préstamos",
    
    // Títulos principales
    mainDashboard: "Dashboard SISTEMAS 1",
    environmentsDashboard: "Ambientes SISTEMAS 1",
    schedulesDashboard: "Programaciones SISTEMAS 1",
    reportsDashboard: "Reportes SISTEMAS 1",
    assignmentsDashboard: "Asignaciones SISTEMAS 1",
    equipmentDashboard: "Equipos SISTEMAS 1",
    usersDashboard: "Usuarios SISTEMAS 1",
    
    // Botones comunes
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    search: "Buscar",
    filter: "Filtrar",
    actions: "Acciones",
    status: "Estado",
    type: "Tipo",
    brand: "Marca",
    model: "Modelo",
    serial: "Serie",
    location: "Ubicación",
    
    // Estados
    available: "Disponible",
    in_use: "En Uso",
    maintenance: "Mantenimiento",
    damaged: "Dañado",
    
    // Tipos de equipo
    computer: "Computador",
    tv: "Televisor",
    projector: "Videobeam",
    sound: "Sonido",

    // Asignaciones
    assignmentTitle: "Gestión de Asignaciones",
    assignmentDescription: "Lista de asignaciones de Sistemas 1",
    assignmentSearch: "Buscar usuario...",
    assignmentButton: "Asignar usuario",
    assignmentCreate: "Crear una asignación",
    assignmentUpdate: "Actualizar una asignación",
    assignmentUser: "Usuario",
    assignmentSelectedUser: "Seleccione un usuario",
    assignmentGroup: "Ficha",
    assignmentSelectedGroup: "Seleccione una ficha",
    assignmentEnvironmentInput: "Ambiente",
    assignmentSelectedEnvironment: "Seleccione un ambiente",
    assignmentDayInput: "Día",
    assignmentStartHourInput: "Hora de inicio",
    assignmentEndHourInput: "Hora de fin",
    assignmentCreateButton: "Guardar",
    assignmentUpdateButton: "Actualizar",
    assignmentUsername: "Usuario y Ficha asignada",
    assignedGroup: "Ficha",
    assignmentEnvironment: "Ambiente asignado",
    assignmentDates: "Fechas de asignación",
    assignmentWarning: "ADVERTENCIA",
    assignmentWarningDescription: "Está a punto de borrar una asignación. Esta acción no se puede deshacer.",
    assignmentWarningAssignment: "Asignación a eliminar:",
    assignmentWarningCancel: "Cancelar",
    assignmentWarningDelete: "Borrar",
    assignmentNotFound: "No se encontraron asignaciones.",
    assignmentSuccessCreate: "¡Asignación creada exitosamente!",
    assignmentSuccessUpdate: "¡Asignación actualizada exitosamente!",
    assignmentSuccessDelete: "¡Asignación eliminada exitosamente!",
    
    // Mensajes
    no_results: "No se encontraron resultados",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    
    // Formularios
    name: "Nombre",
    email: "Correo",
    password: "Contraseña",
    confirm_password: "Confirmar Contraseña",
    login: "Iniciar Sesión",
    register: "Registrarse",
    
    // Modales
    confirm_delete: "¿Está seguro de que desea eliminar este elemento?",
    delete_warning: "Esta acción no se puede deshacer",
    close: "Cerrar",
    
    // Landing Page
    signIn: "Iniciar Sesión",
    smartSecurityForClassrooms: "Seguridad Inteligente para Aulas",
    landingDescription: "Sistema integral de monitoreo y gestión para ambientes educativos con tecnología avanzada y control en tiempo real.",
    learnMore: "Conocer Más",
    ourFeatures: "Nuestras Características",
    featuresDescription: "Descubre las funcionalidades que hacen de SENASEC la mejor opción para la seguridad educativa.",
    systemAdvantages: "Ventajas del Sistema",
    systemAdvantagesDescription: "Beneficios clave que ofrece nuestra plataforma de seguridad integral.",
    integralSecurity: "Seguridad Integral",
    integralSecurityDesc: "Monitoreo completo de todos los aspectos de seguridad en tiempo real.",
    centralizedManagement: "Gestión Centralizada",
    centralizedManagementDesc: "Control total desde una sola plataforma administrativa.",
    realTimeAlerts: "Alertas en Tiempo Real",
    realTimeAlertsDesc: "Notificaciones instantáneas ante cualquier evento de seguridad.",
    supportAndReports: "Soporte y Reportes",
    supportAndReportsDesc: "Asistencia técnica 24/7 y reportes detallados de actividad.",
    supportAndIssueRegister: "Soporte y Registro de Incidencias",
    supportAndIssueRegisterDesc: "¿Tienes algún problema o sugerencia? Contáctanos y te ayudaremos.",
    sendMessage: "Enviar Mensaje",
    contactInfo: "Información de Contacto",
    followUs: "Síguenos",
    
    // Features
    securityMonitoring: "Monitoreo de Seguridad",
    securityMonitoringDesc: "Vigilancia continua de todos los espacios educativos.",
    alertSystem: "Sistema de Alertas",
    alertSystemDesc: "Notificaciones inmediatas ante eventos críticos.",
    smartAutomation: "Automatización Inteligente",
    smartAutomationDesc: "Procesos automatizados para mayor eficiencia.",
    remoteAccess: "Acceso Remoto",
    remoteAccessDesc: "Control y monitoreo desde cualquier ubicación.",
    
    // Reports
    reportsDescription: "Gestión y seguimiento de reportes de usuarios",
    reportsComingSoon: "Este dashboard estará disponible próximamente con reportes detallados del sistema.",
    reportExportButton: "Exportar",
    reportCreateButton: "Crear reporte",
    reportSearchUser: "Buscar por usuario...",
    reportStatusFilter: "Todos los estados",
    reportStatusComplete: "Completo",
    reportStatusPending: "Pendiente",
    reportStatusReviewed: "Revisado",
    reportProgrammingNumber: "No. Programación",
    reportUser: "Usuario",
    reportDate: "Fecha",
    reportStartHour: "Hora entrada",
    reportEndHour: "Hora salida",
    reportStatus: "Estado",
    reportNotFoundTitle: "No hay reportes",
    reportNotFoundDescription: "No se encontraron reportes que coincidan con los criterios de búsqueda.",
    reportCreate: "Crear reporte",
    reportUpdate: "Actualizar reporte",
    reportCreateConfirm: "Crear reporte",
    reportProgrammingNumberInput: "Seleccione un número de programación",
    reportStatusInput: "Seleccione un estado",
    reportWarning: "ADVERTENCIA",
    reportWarningDescription: "Esta a punto de eliminar un reporte, esta acción no se puede deshacer.",
    reportWarningAssignment: "Reporte a eliminar:",
    reportWarningCancel: "Cancelar",
    reportWarningDelete: "Borrar",
    reportSuccessCreate: "¡Reporte creado exitosamente!",
    reportSuccessUpdate: "¡Reporte actualizado exitosamente!",
    reportSuccessDelete: "¡Reporte eliminado exitosamente!",

    //inventorty

    environmentTitle: "Gestión de Ambientes",
    environmentLeyendStatus: "Leyenda de estados",
    environmentDescription: "Lista de ambientes de Sistemas 1",
    environmentAvailableStatus: "Disponible",
    environmentMaintenenaceStatus: "Mantenimiento",
    environmentDamaged: "Dañado",
    environmentClassroomDistribution: "Distribución de aulas",
    environmentDistributionDoor: "Puerta",
    environmentDistributionFreeArea: "Área libre",
    environmentClassroomEquipment: "Equipos del aula",
    environmentpositionEquipment: "Numero de equipo",
    environmentSerialEquipment: "Número de serie",
    environmentTypeEquipment: "Tipo de equipo",
    environmentStatusEquipment: "Estado del equipo",
    environmentRegisterNovelty: "Registrar novedad",
    environmentOfEnvironment: "Ambiente",
    environmentSelectEnvironment: "Seleccione un ambiente",
    environmentInputEnvironment: "Registre si hay alguna novedad con algún equipo, daños o pérdidas. Máx. 500 caracteres",
    environmentSubmitReport: "Enviar",
    environmentNoSerial: "Número de serie",
    environmentSize: "Pulgadas''",
    environmentCharacteristics: "Características",
    environmentlastupdate: "Última actualización",

    //equipment
    equipmentrestrictedAccess: "Acceso Restringido",
    equipmentdonothavepermissiontoaccess: "No tienes permiso para acceder a este módulo",
    equipmentSearch: "Buscar por número de serie, tipo, estado o características...",
    equipmentNumberEquipment: "No. Equipo",
    equipmentNumberSerial: "No. Serie",
    equipmentType: "Tipo",
    equipmentInches: "Pulgadas",
    equipmentStatus: "Estado",
    equipmentLastUpdate: "Última Actualización",
    equipmentActions: "Acciones",
    equipmentNoequipmentwasfoundthatmatchedthefilters: "No se encontró ningún equipo que coincidiera con los filtros",
    equipmentCharacteristics: "Características",
    equipmentavailable: "Disponible",
    equipmentMaintenenace: "Mantenimiento",
    equipmentDamaged: "Dañado",
    equipmentEnvironment: "Ambiente",
    equipmentSelectionEnvironment: "Seleccione un ambiente",
    equipmentCancel: "Cancelar",
    equipmentUpdate: "Actualizar",
    equipmentSuccessUpdate: "¡Equipo actualizado exitosamente!",

    //users
    usermanagement: "Gestión de Usuarios",
    userManageSENASECsystemusers: "Administracion de usuarios del sistema SENASEC",
    userSearch: "Buscar usuario por documento o email...",
    userAllRoles: "Todos los roles",
    userfullname: "Nombre completo",
    userRole: "Rol",
    userActions: "Acciones",
    userNoUsersWereFoundMatchingSearchCriteria: "No se encontraron usuarios que coincidan con los criterios de búsqueda.",
    useremail: "Correo",
    userphone: "Teléfono",
    usernewpassword: "Nueva contraseña (opcional)",
    userpassword: "Contraseña",
    userplaceholdernewpassword: "Ingrese nueva contraseña",
    userplaceholderpassword: "Ingrese una contraseña",
    userFaceCapture: "Captura facial",
    userFaceCaptureButton: "Inicial captura facial",
    userWarning: "ADVERTENCIA",
    userCreateButton: "Registrar",
    userUpdateButton: "Actualizar",
    userWarningDescription: "Está a punto de borrar un usuario. Esta acción no se puede deshacer.",
    userToDelete: "Usuario a eliminar",
    userCancel: "Cancelar",
    userDeleteUser: "Borrar usuario",
    userSuccessUpdate: "¡Usuario actualizado exitosamente!",
    userSuccessDelete: "¡Usuario eliminado exitosamente!",
  },








  
  en: {
    // Navigation
    dashboard: "Dashboard",
    environments: "Environments",
    schedules: "Schedules",
    reports: "Reports",
    assignments: "Assignments",
    equipment: "Equipment",
    users: "Users",
    logout: "Logout",
    menu: "Menu",
    language: "Language",
    theme: "Theme",
    allRightsReserved: "All rights reserved",
    contact: "Contact",
    
    // Days of the week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday", 
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    today: "TODAY",
    currentWeek: "Current Week",
    programmingYear: "Year",
    
    // Schedules and shifts
    morningShift: "Morning Shift",
    afternoonShift: "Afternoon Shift",
    nightShift: "Night Shift", 
    cleaningTime: "Cleaning Time",
    allClassrooms: "All classrooms",
    allInstructors: "All instructors",
    allShifts: "All shifts",
    free: "Free",
    legend: "Legend",
    journal: "JOURNAL",
    realTimeScheduleSystem: "Real time schedule system",
    statusLegend: "Status legend",
    assignedInstructor: "Assigned Instructor",
    programmingAvailable: "Available",
    weeklySchedule: "Weekly Schedule",
    week: "Week",
    of: "of",
    programmingStatus: "AVAILABLE",

    // Assignments
    assignmentTitle: "Assignment Management",
    assignmentDescription: "List of Systems 1 assignments",
    assignmentDates: "Assignment Dates",
    assignmentSearch: "Search user...",
    assignmentButton: "Assign user",
    assignmentCreate: "Create an assignment",
    assignmentUpdate: "Update an assignment",
    assignmentUser: "Username",
    assignmentSelectedUser: "Select an user",
    assignmentGroup: "Group",
    assignmentSelectedGroup: "Select a group",
    assignmentEnvironmentInput: "Environment",
    assignmentSelectedEnvironment: "Select an environment",
    assignmentDayInput: "Day",
    assignmentStartHourInput: "Start Hour",
    assignmentEndHourInput: "End Hour",
    assignmentCreateButton: "Save",
    assignmentUpdateButton: "Update",
    assignmentUsername: "User and Group assigned",
    assignmentEnvironment: "Assigned Environment",
    assignedGroup: "Group",
    assignmentWarning: "WARNING",
    assignmentWarningDescription: "You are about to delete an assignment. This action cannot be undone.",
    assignmentWarningAssignment: "Assignment to delete:",
    assignmentWarningCancel: "Cancel",
    assignmentWarningDelete: "Delete",
    assignmentNotFound: "No assignments found.",
    assignmentSuccessCreate: "Assignment successfully created!",
    assignmentSuccessUpdate: "Assignment successfully updated!",
    assignmentSuccessDelete: "Assignment successfully deleted!",
    
    // Dashboard stats
    totalElements: "Total Elements",
    availableElements: "Available Elements",
    myActiveLoans: "My Active Loans",
    myOverdueLoans: "My Overdue Loans",
    totalMyLoans: "Total My Loans",
    attention: "Attention",
    upToDate: "Up to Date",
    welcome: "Welcome",
    administrator: "Administrator",
    standardUser: "Standard User",
    admin: "ADMIN",
    user: "USER",
    
    // Notifications
    youHaveOverdueLoans: "You have {{count}} overdue loan(s)",
    pleaseReturnItems: "Please return the items as soon as possible",
    allLoansUpToDate: "All your loans are up to date!",
    excellentLoanManagement: "Excellent management of your loans",
    
    // Main titles
    mainDashboard: "SYSTEMS 1 Dashboard",
    environmentsDashboard: "SYSTEMS 1 Environments",
    schedulesDashboard: "SYSTEMS 1 Schedules",
    reportsDashboard: "SYSTEMS 1 Reports",
    assignmentsDashboard: "SYSTEMS 1 Assignments",
    equipmentDashboard: "SYSTEMS 1 Equipment",
    usersDashboard: "SYSTEMS 1 Users",
    
    // Common buttons
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    status: "Status",
    type: "Type",
    brand: "Brand",
    model: "Model",
    serial: "Serial",
    location: "Location",
    
    // Status
    available: "Available",
    in_use: "In Use",
    maintenance: "Maintenance",
    damaged: "Damaged",
    
    // Equipment types
    computer: "Computer",
    tv: "TV",
    projector: "Projector",
    sound: "Sound",
    
    // Messages
    no_results: "No results found",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Forms
    name: "Name",
    email: "Email",
    password: "Password",
    confirm_password: "Confirm Password",
    login: "Login",
    register: "Register",
    
    // Modals
    confirm_delete: "Are you sure you want to delete this item?",
    delete_warning: "This action cannot be undone",
    close: "Close",
    
    // Landing Page
    signIn: "Sign In",
    smartSecurityForClassrooms: "Smart Security for Classrooms",
    landingDescription: "Comprehensive monitoring and management system for educational environments with advanced technology and real-time control.",
    learnMore: "Learn More",
    ourFeatures: "Our Features",
    featuresDescription: "Discover the functionalities that make SENASEC the best choice for educational security.",
    systemAdvantages: "System Advantages",
    systemAdvantagesDescription: "Key benefits offered by our comprehensive security platform.",
    integralSecurity: "Comprehensive Security",
    integralSecurityDesc: "Complete monitoring of all security aspects in real time.",
    centralizedManagement: "Centralized Management",
    centralizedManagementDesc: "Total control from a single administrative platform.",
    realTimeAlerts: "Real-Time Alerts",
    realTimeAlertsDesc: "Instant notifications for any security event.",
    supportAndReports: "Support and Reports",
    supportAndReportsDesc: "24/7 technical assistance and detailed activity reports.",
    supportAndIssueRegister: "Support and Issue Registration",
    supportAndIssueRegisterDesc: "Do you have any problems or suggestions? Contact us and we'll help you.",
    sendMessage: "Send Message",
    contactInfo: "Contact Information",
    followUs: "Follow Us",
    
    // Features
    securityMonitoring: "Security Monitoring",
    securityMonitoringDesc: "Continuous surveillance of all educational spaces.",
    alertSystem: "Alert System",
    alertSystemDesc: "Immediate notifications for critical events.",
    smartAutomation: "Smart Automation",
    smartAutomationDesc: "Automated processes for greater efficiency.",
    remoteAccess: "Remote Access",
    remoteAccessDesc: "Control and monitoring from any location.",
    
    // Reports
    reportsDescription: "Management and monitoring of user reports",
    reportExportButton: "Export",
    reportCreateButton: "Create report",
    reportSearchUser: "Search by user...",
    reportStatusFilter: "All status",
    reportStatusComplete: "Complete",
    reportStatusPending: "Pending",
    reportStatusReviewed: "Reviewed",
    reportProgrammingNumber: "Programming number",
    reportUser: "User",
    reportDate: "Date",
    reportStartHour: "Entry time",
    reportEndHour: "Departure time",
    reportStatus: "Status",
    reportNotFoundTitle: "There are no reports",
    reportNotFoundDescription: "No reports matching the search criteria were found.",
    reportCreate: "Create report",
    reportUpdate: "Update report",
    reportCreateConfirm: "Create report",
    reportProgrammingNumberInput: "Select a programming number",
    reportStatusInput: "Select a status",
    reportWarning: "WARNING",
    reportWarningDescription: "You are about to delete a report. This action cannot be undone.",
    reportWarningAssignment: "Report to be deleted:",
    reportWarningCancel: "Cancel",
    reportWarningDelete: "Delete",
    reportSuccessCreate: "Report successfully created!",
    reportSuccessUpdate: "Report successfully updated!",
    reportSuccessDelete: "Report successfully deleted!",


    //inventory
    environmentTitle:  "Environment Management",
    environmentLeyendStatus: "Status Legend",
    environmentDescription: "List of Systems 1 environments",
    environmentAvailableStatus: "Available",
    environmentMaintenenaceStatus: "Maintenance",
    environmentDamaged: "Damaged",
    environmentClassroomDistribution: "Classroom Distribution",
    environmentDistributionDoor: "Door",
    environmentDistributionFreeArea: "Free Area",
    environmentClassroomEquipment: "Classroom Equipment",
    environmentpositionEquipment: "Equipment Number",
    environmentSerialEquipment: "Serial Number",
    environmentTypeEquipment: "Equipment Type",
    environmentStatusEquipment: "Equipment Status",
    environmentRegisterNovelty: "Register Novelty",
    environmentOfEnvironment: "Environment",
    environmentSelectEnvironment: "Select an environment",
    environmentInputEnvironment: "Record any new developments regarding equipment, damage, or losses. Max. 500 characters",
    environmentSubmitReport: "Submit",
    environmentNoSerial: "Serial Number",
    environmentSize: "Inches''",
    environmentCharacteristics: "Characteristics",
    environmentlastupdate: "Last Update",


     //equipment
    equipmentrestrictedAccess: "Restricted Access",
    equipmentdonothavepermissiontoaccess: "You do not have permission to access this module",
    equipmentNumberEquipment: "Equipment Number",
    equipmentNumberSerial: "Serial Number",
    equipmentSearch: "Search by serial number, type, status or characteristics...",
    equipmentType: "Type",
    equipmentInches: "Inches",
    equipmentStatus: "Status",
    equipmentLastUpdate: "Last Update",
    equipmentActions: "Actions",
    equipmentNoequipmentwasfoundthatmatchedthefilters: "No equipment was found that matched the filters",
    equipmentCharacteristics: "Characteristics",
    equipmentavailable: "Available",
    equipmentMaintenenace: "Maintenance",
    equipmentDamaged: "Damaged",
    equipmentEnvironment: "Environment",
    equipmentSelectionEnvironment: "Select an environment",
    equipmentCancel: "Cancel",
    equipmentUpdate: "Update",
    equipmentSuccessUpdate: "Equipment successfully updated!",

    //users
    usermanagement: "User Management",
    userManageSENASECsystemusers: "Management of SENASEC system users",
    userSearch: "Search user by document or email...",
    userAllRoles: "All Roles",
    userfullname: "Full Name",
    userRole: "Role",
    userActions: "Actions",
    userNoUsersWereFoundMatchingSearchCriteria: "No users were found matching search criteria.",
    useremail: "Email",
    userphone: "Phone",
    usernewpassword: "New password (optional)",
    userpassword: "Password",
    userplaceholdernewpassword: "Type a new password",
    userplaceholderpassword: "Type a password",
    userFaceCapture: "Face Capture",
    userFaceCaptureButton: "Start facial capture",
    userWarning: "WARNING",
    userCreateButton: "Register",
    userUpdateButton: "Update",
    userWarningDescription: "You are about to delete a user. This action cannot be undone.",
    userToDelete: "User to delete",
    userCancel: "Cancel",
    userDeleteUser: "Delete User",
    userSuccessUpdate: "User successfully updated!",
    userSuccessDelete: "User successfully deleted!",

    
  }
};

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('senasec-language');
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    console.log('=== CONTEXTO: CAMBIO DE IDIOMA ===');
    console.log('Idioma anterior:', language);
    console.log('Nuevo idioma:', lang);
    
    try {
      // Forzar re-render completo
      setLanguageState(lang);
      localStorage.setItem('senasec-language', lang);
      
      // Forzar actualización del DOM
      setTimeout(() => {
        window.dispatchEvent(new Event('languageChanged'));
      }, 0);
      
      console.log('Estado actualizado exitosamente');
      console.log('Idioma guardado en localStorage:', localStorage.getItem('senasec-language'));
    } catch (error) {
      console.error('Error en setLanguage:', error);
    }
  };

  const t = (key: string): string => {
    // Obtener idioma actual del estado más reciente
    const currentLang = language;
    const translation = translations[currentLang]?.[key as keyof typeof translations.es];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
      // Intentar con archivos JSON externos como fallback
      return key;
    }
    return translation;
  };

  useEffect(() => {
    console.log('LanguageProvider - idioma actual:', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};