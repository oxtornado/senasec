import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Lock, Cloud, Package, Calendar, Moon, Sun, BarChart3, UserCheck, Settings, Users, Menu, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useBreakpoints } from "../hooks/useMediaQuery";
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
  const { isMobile, isTablet } = useBreakpoints();
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      { name: t('environments'), href: "/dashboard/inventory", icon: Package },
      { name: t('schedules'), href: "/dashboard/loans", icon: Calendar },
      { name: t('reports'), href: "/dashboard/reports", icon: BarChart3 },
    ];
    
    // Si es administrador, agregar opciones adicionales
    if (currentUser.rol == "admin") {
      return [
        ...baseNavigation,
        { name: t('assignments'), href: "/dashboard/assignments", icon: UserCheck },
        { name: t('equipment'), href: "/dashboard/equipment", icon: Settings },
        { name: t('users'), href: "/dashboard/users", icon: Users },
      ];
    }

    // Si es jefe de inventarios, agregar opciones adicionales
    if (currentUser.rol == "inventario") {
      return [
        ...baseNavigation,
        { name: t('equipment'), href: "/dashboard/equipment", icon: Settings },
      ];
    }
    
    return baseNavigation;
  };

  const roleStyles = {
    admin: {
      label: t('ADMIN'),
      className: 'bg-red-100 text-red-800 border border-red-400 dark:bg-red-900 dark:text-red-200 dark:border-none',
    },
    instructor: {
      label: t('INSTRUCTOR'),
      className: 'bg-blue-100 text-blue-800 border border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-none',
    },
    aseo: {
      label: t('ASEO'),
      className: 'bg-green-100 text-green-800 border border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-none',
    },
    seguridad: {
      label: t('SEGURIDAD'),
      className: 'bg-yellow-100 text-yellow-800 border border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-none',
    },
    inventario: {
      label: t('INVENTARIO'),
      className: 'bg-purple-100 text-purple-800 border border-purple-400 dark:bg-purple-900 dark:text-purple-200 dark:border-none',
    },
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
      <nav className="border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 xl:px-8">
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
              
              {/* Desktop Navigation */}
              <div className="hidden xl:ml-10 xl:flex xl:items-center xl:space-x-4">
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
            <div className="flex items-center space-x-2 xl:space-x-4">
              {/* Desktop User Info */}
              {currentUser && (
                <div className="hidden xl:flex xl:items-center xl:space-x-2">
                  {(() => {
                    const role = currentUser.rol;
                    const roleInfo = roleStyles[role] || {
                      label: t('USER'),
                      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                    };

                    return (
                      <span className={`px-2 py-1 text-xs rounded-full ${roleInfo.className}`}>
                        {roleInfo.label}
                      </span>
                    );
                  })()}
                </div>
              )}
              
              {/* Desktop Controls */}
              <div className="hidden xl:flex xl:items-center xl:space-x-4">
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
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-md"
                >
                  {t('logout')}
                </button>
              </div>
              
              {/* Mobile Language Selector - Only visible on mobile */}
              <div className="xl:hidden">
                <LanguageSelector />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 min-h-touch"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="xl:hidden">
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl">
              <div className="flex h-16 items-center justify-between px-4 border-b dark:border-gray-700">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('menu')}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="px-4 py-6 space-y-6">
                {/* User Info */}
                {currentUser && (
                  <div className="pb-6 border-b dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300 font-semibold">
                            {currentUser.username.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUser.username}
                        </p>
                        {(() => {
                          const role = currentUser.rol;
                          const roleInfo = roleStyles[role] || {
                            label: t('USER'),
                            className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                          };

                          return (
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${roleInfo.className}`}>
                              {roleInfo.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={clsx(
                          "flex items-center px-3 py-3 text-base font-medium rounded-md min-h-touch",
                          location.pathname === item.href
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                        )}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Controls */}
                <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('language')}</span>
                    <LanguageSelector />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('theme')}</span>
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 min-h-touch"
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-red-600 border border-red-400 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 rounded-md min-h-touch dark:border-none"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <main className="flex-grow py-6 md:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8 py-6">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 SENASEC. {t("allRightsReserved")}</p>
              <p>
                {t("contact")}: soporte@senasec.com | {t("tel")}: (123) 456-7890
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;