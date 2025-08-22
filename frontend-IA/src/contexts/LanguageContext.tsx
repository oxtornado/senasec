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
    reportsDescription: "Análisis y reportes del sistema",
    reportsComingSoon: "Este dashboard estará disponible próximamente con reportes detallados del sistema."
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
    reportsDescription: "System analysis and reports",
    reportsComingSoon: "This dashboard will be available soon with detailed system reports."
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
    console.log('setLanguageState function:', typeof setLanguageState);
    
    try {
      setLanguageState(lang);
      localStorage.setItem('senasec-language', lang);
      
      console.log('Estado actualizado exitosamente');
      console.log('Idioma guardado en localStorage:', localStorage.getItem('senasec-language'));
    } catch (error) {
      console.error('Error en setLanguage:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations.es];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
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
