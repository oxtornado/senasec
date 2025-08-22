import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Lock, Cloud, Package, Calendar, Moon, Sun, BarChart3, UserCheck, Settings, Users } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import clsx from "clsx";
import LanguageSelector from "./LanguageSelector";
import { getCurrentUser } from "../services/auth";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  preferred_language: string;
}

const Layout = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false");
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getCurrentUser();
        setCurrentUser(userResponse);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Navegación diferenciada por tipo de usuario
  const getNavigation = () => {
    if (!currentUser) return [];
    
    const baseNavigation = [
      { name: "Ambientes", href: "/dashboard/inventory", icon: Package },
      { name: "Programaciones", href: "/dashboard/loans", icon: Calendar },
      { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
    ];
    
    // Si es administrador, agregar opciones adicionales
    if (currentUser.is_admin) {
      return [
        ...baseNavigation,
        { name: "Asignaciones", href: "/dashboard/assignments", icon: UserCheck },
        { name: "Equipos", href: "/dashboard/equipment", icon: Settings },
        { name: "Usuarios", href: "/dashboard/users", icon: Users },
      ];
    }
    
    return baseNavigation;
  };
  
  const navigation = getNavigation();

  // Mostrar loading mientras se obtiene la información del usuario
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Lock className="h-6 w-6" />
                  <Cloud className="h-6 w-6 -ml-2" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  SENASEC
                </span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        location.pathname === item.href
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mostrar información del usuario */}
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {currentUser.full_name}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentUser.is_admin 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {currentUser.is_admin ? 'ADMIN' : 'USUARIO'}
                  </span>
                </div>
              )}
              <LanguageSelector />
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              {/* Botón de logout */}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 SENASEC. {t("allRightsReserved")}</p>
            <p>
              {t("contact")}: soporte@senasec.com | {t("tel")}: (123) 456-7890
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
