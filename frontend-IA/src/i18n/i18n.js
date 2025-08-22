import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Recursos de traducción embebidos
const resources = {
  es: {
    translation: {
      "smartSecurityForClassrooms": "Seguridad Inteligente para Aulas",
      "landingDescription": "Sistema avanzado de monitoreo y gestión para mantener seguras tus aulas y equipos educativos.",
      "signIn": "Iniciar sesión",
      "learnMore": "Conocer más",
      "ourFeatures": "Nuestras Características",
      "featuresDescription": "SENASEC ofrece una amplia gama de funciones para mantener seguras tus aulas y equipos.",
      "securityMonitoring": "Monitoreo de Seguridad",
      "securityMonitoringDesc": "Monitoreo en tiempo real de todos los equipos y accesos del aula.",
      "alertSystem": "Sistema de Alertas",
      "alertSystemDesc": "Notificaciones instantáneas para eventos sospechosos o no autorizados.",
      "smartAutomation": "Automatización Inteligente",
      "smartAutomationDesc": "Control de acceso automatizado y seguimiento de préstamos de equipos.",
      "remoteAccess": "Acceso Remoto",
      "remoteAccessDesc": "Gestiona la seguridad de tu aula desde cualquier lugar, en cualquier dispositivo.",
      "systemAdvantages": "Ventajas del sistema",
      "systemAdvantagesDescription": "Descubre por qué SENASEC es la mejor opción para la seguridad y gestión de tus aulas.",
      "integralSecurity": "Seguridad Integral",
      "integralSecurityDesc": "Protección avanzada de equipos y recursos en las aulas, minimizando riesgos y pérdidas.",
      "centralizedManagement": "Gestión Centralizada",
      "centralizedManagementDesc": "Control y monitoreo desde una sola plataforma intuitiva y accesible en cualquier momento.",
      "realTimeAlerts": "Alertas en Tiempo Real",
      "realTimeAlertsDesc": "Notificaciones inmediatas ante cualquier incidente o novedad relevante en el sistema.",
      "supportAndReports": "Soporte y Reportes",
      "supportAndReportsDesc": "Registro y seguimiento fácil de novedades o problemas para una atención ágil y eficiente.",
      "supportAndIssueRegister": "Soporte y Registro de Novedades",
      "supportAndIssueRegisterDesc": "¿Tienes algún problema o novedad? Regístralo aquí y nuestro equipo te ayudará.",
      "sendMessage": "Enviar Mensaje",
      "contactInfo": "Información de Contacto",
      "followUs": "Síguenos",
      
      // Navegación
      "dashboard": "Dashboard",
      "environments": "Ambientes",
      "schedules": "Programaciones",
      "reports": "Reportes",
      "assignments": "Asignaciones",
      "equipment": "Equipos",
      "users": "Usuarios",
      "logout": "Cerrar Sesión",
      
      // Títulos de páginas
      "equipmentDashboard": "Equipos SISTEMAS 1",
      "schedulingDashboard": "Programaciones SISTEMAS 1",
      "environmentsDashboard": "Ambientes SISTEMAS 1",
      "userManagement": "Gestión de Usuarios",
      
      // Botones comunes
      "add": "Agregar",
      "edit": "Editar",
      "delete": "Eliminar",
      "save": "Guardar",
      "cancel": "Cancelar",
      "search": "Buscar",
      "filter": "Filtrar"
    }
  },
  en: {
    translation: {
      "smartSecurityForClassrooms": "Smart Security for Classrooms",
      "landingDescription": "Advanced monitoring and management system to keep your classrooms and educational equipment secure.",
      "signIn": "Sign In",
      "learnMore": "Learn More",
      "ourFeatures": "Our Features",
      "featuresDescription": "SENASEC offers a wide range of features designed to keep your classrooms secure and your equipment protected.",
      "securityMonitoring": "Security Monitoring",
      "securityMonitoringDesc": "Real-time monitoring of all equipment and classroom access.",
      "alertSystem": "Alert System",
      "alertSystemDesc": "Instant notifications for suspicious or unauthorized events.",
      "smartAutomation": "Smart Automation",
      "smartAutomationDesc": "Automated access control and equipment loan tracking.",
      "remoteAccess": "Remote Access",
      "remoteAccessDesc": "Manage your classroom security from anywhere, on any device.",
      "systemAdvantages": "System Advantages",
      "systemAdvantagesDescription": "Discover why SENASEC is the best choice for classroom security and management.",
      "integralSecurity": "Integral Security",
      "integralSecurityDesc": "Advanced protection for classroom equipment and resources, minimizing risks and losses.",
      "centralizedManagement": "Centralized Management",
      "centralizedManagementDesc": "Control and monitoring from a single, intuitive, and accessible platform at any time.",
      "realTimeAlerts": "Real-Time Alerts",
      "realTimeAlertsDesc": "Instant notifications for any incident or relevant event in the system.",
      "supportAndReports": "Support and Reports",
      "supportAndReportsDesc": "Easy tracking and reporting of issues for fast and efficient support.",
      "supportAndIssueRegister": "Support and Issue Register",
      "supportAndIssueRegisterDesc": "Do you have a problem or issue? Register it here and our team will help you.",
      "sendMessage": "Send Message",
      "contactInfo": "Contact Information",
      "followUs": "Follow Us",
      
      // Navigation
      "dashboard": "Dashboard",
      "environments": "Environments",
      "schedules": "Schedules",
      "reports": "Reports",
      "assignments": "Assignments",
      "equipment": "Equipment",
      "users": "Users",
      "logout": "Logout",
      
      // Page titles
      "equipmentDashboard": "SYSTEMS 1 Equipment",
      "schedulingDashboard": "SYSTEMS 1 Schedules",
      "environmentsDashboard": "SYSTEMS 1 Environments",
      "userManagement": "User Management",
      
      // Common buttons
      "add": "Add",
      "edit": "Edit",
      "delete": "Delete",
      "save": "Save",
      "cancel": "Cancel",
      "search": "Search",
      "filter": "Filter"
    }
  }
};

// Función para cambiar idioma
const changeLanguage = (lng) => {
  console.log('Cambiando idioma a:', lng);
  i18n.changeLanguage(lng);
  localStorage.setItem('senasec-language', lng);
  console.log('Idioma cambiado y guardado:', lng);
};

// Exportar función para uso externo
window.changeLanguage = changeLanguage;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("senasec-language") || "es",
    fallbackLng: "es",
    debug: true,
    
    interpolation: {
      escapeValue: false,
    },
  });

// Log inicial
console.log('i18n inicializado con idioma:', i18n.language);
console.log('Idioma en localStorage:', localStorage.getItem('senasec-language'));

export default i18n;
