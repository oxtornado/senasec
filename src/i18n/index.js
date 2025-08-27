import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import api from "../services/api";

// Cargar traducciones iniciales
const resources = {
  es: {
    translation: {
      // Traducciones por defecto en español
      welcome: "Bienvenido a SENASEC",
      login: "Iniciar sesión",
      register: "Registrarse",
      inventory: "Inventario",
      loans: "Préstamos",
      available: "Disponible",
      in_use: "En uso",
      maintenance: "Mantenimiento",
      pending: "Pendiente",
      active: "Activo",
      returned: "Devuelto",
      overdue: "Atrasado",
      item: "Elemento",
      status: "Estado",
      location: "Ubicación",
      actions: "Acciones",
      addItem: "Agregar elemento",
      searchItems: "Buscar elementos...",
      all: "Todos",
      confirmDelete: "¿Está seguro de que desea eliminar este elemento?",
      itemDeleted: "Elemento eliminado correctamente",
      errorDeletingItem: "Error al eliminar el elemento",
      errorFetchingInventory: "Error al cargar el inventario",
      systemDescription: "Sistema de Seguridad Inteligente para Aulas",
      email: "Correo electrónico",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loggingIn: "Iniciando sesión...",
      loginSuccess: "Inicio de sesión exitoso",
      loginError: "Error al iniciar sesión",
      noAccount: "¿No tienes una cuenta?",
      allRightsReserved: "Todos los derechos reservados",
      contact: "Contacto",
      tel: "Tel",
    },
  },
  en: {
    translation: {
      // Traducciones por defecto en inglés
      welcome: "Welcome to SENASEC",
      login: "Log in",
      register: "Register",
      inventory: "Inventory",
      loans: "Loans",
      available: "Available",
      in_use: "In use",
      maintenance: "Maintenance",
      pending: "Pending",
      active: "Active",
      returned: "Returned",
      overdue: "Overdue",
      item: "Item",
      status: "Status",
      location: "Location",
      actions: "Actions",
      addItem: "Add item",
      searchItems: "Search items...",
      all: "All",
      confirmDelete: "Are you sure you want to delete this item?",
      itemDeleted: "Item deleted successfully",
      errorDeletingItem: "Error deleting item",
      errorFetchingInventory: "Error loading inventory",
      systemDescription: "Smart Security System for Classrooms",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot your password?",
      loggingIn: "Logging in...",
      loginSuccess: "Login successful",
      loginError: "Login error",
      noAccount: "Don't have an account?",
      allRightsReserved: "All rights reserved",
      contact: "Contact",
      tel: "Phone",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

// Función para cargar traducciones desde el backend
export const loadTranslations = async (language) => {
  try {
    const response = await api.get(`/api/i18n/${language}`);
    i18n.addResourceBundle(language, "translation", response.data, true, true);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  } catch (error) {
    console.error("Error loading translations:", error);
  }
};

export default i18n;
