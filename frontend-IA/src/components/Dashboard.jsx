import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Package, Calendar, AlertTriangle, CheckCircle, User, Shield } from "lucide-react";
import { getInventoryItems } from "../services/inventory";
import { getLoans } from "../services/loans";
import { getCurrentUser } from "../services/auth";

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center`}
    >
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    activeLoans: 0,
    overdueLoans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const userResponse = await getCurrentUser();
        setCurrentUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);

        // Obtener datos de inventario (solo admins ven todo el inventario)
        const inventoryResponse = await getInventoryItems();
        const items = inventoryResponse.data || [];

        // Obtener datos de préstamos
        const loansResponse = await getLoans();
        const loans = loansResponse.data || [];

        // Calcular estadísticas según el tipo de usuario
        let filteredLoans = loans;
        
        // Si es usuario estándar, solo mostrar sus propios préstamos
        if (!currentUser.is_admin) {
          filteredLoans = loans.filter(loan => loan.user_id === currentUser.id);
        }
        
        const availableItems = items.filter(
          (item) => item.status === "available",
        ).length;
        const activeLoans = filteredLoans.filter(
          (loan) => loan.status === "active",
        ).length;
        const overdueLoans = filteredLoans.filter(
          (loan) => loan.status === "overdue",
        ).length;

        setStats({
          totalItems: currentUser.is_admin ? items.length : filteredLoans.length,
          availableItems: currentUser.is_admin ? availableItems : 0,
          activeLoans,
          overdueLoans,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (userLoading || loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">Error al cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              currentUser.is_admin ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'
            }`}>
              {currentUser.is_admin ? (
                <Shield className={`h-6 w-6 ${
                  currentUser.is_admin ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'
                }`} />
              ) : (
                <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("dashboard")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bienvenido, {currentUser.full_name} ({currentUser.is_admin ? 'Administrador' : 'Usuario Estándar'})
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentUser.is_admin 
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {currentUser.is_admin ? 'ADMIN' : 'USUARIO'}
          </div>
        </div>
      </div>

      {/* Estadísticas diferenciadas por tipo de usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUser.is_admin ? (
          // Vista de Administrador - Estadísticas completas del sistema
          <>
            <StatCard
              title="Total de Elementos"
              value={stats.totalItems}
              icon={Package}
              color="bg-blue-500"
            />
            <StatCard
              title="Elementos Disponibles"
              value={stats.availableItems}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Préstamos Activos"
              value={stats.activeLoans}
              icon={Calendar}
              color="bg-purple-500"
            />
            <StatCard
              title="Préstamos Vencidos"
              value={stats.overdueLoans}
              icon={AlertTriangle}
              color="bg-red-500"
            />
          </>
        ) : (
          // Vista de Usuario Estándar - Solo sus préstamos
          <>
            <StatCard
              title="Mis Préstamos Activos"
              value={stats.activeLoans}
              icon={Calendar}
              color="bg-purple-500"
            />
            <StatCard
              title="Mis Préstamos Vencidos"
              value={stats.overdueLoans}
              icon={AlertTriangle}
              color="bg-red-500"
            />
            <StatCard
              title="Total de Mis Préstamos"
              value={stats.totalItems}
              icon={Package}
              color="bg-blue-500"
            />
            <StatCard
              title="Estado"
              value={stats.overdueLoans > 0 ? "Atención" : "Al día"}
              icon={stats.overdueLoans > 0 ? AlertTriangle : CheckCircle}
              color={stats.overdueLoans > 0 ? "bg-red-500" : "bg-green-500"}
            />
          </>
        )}
      </div>

      {/* Gráficos y información adicional diferenciada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentUser.is_admin ? (
          // Vista de Administrador - Gráficos del sistema completo
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estado del Inventario General
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Vista completa del inventario del sistema
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Gráficos próximamente
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tendencia de Préstamos del Sistema
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Análisis de todos los préstamos
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Gráficos próximamente
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Vista de Usuario Estándar - Solo información personal
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Historial de Mis Préstamos
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Tu historial personal de préstamos
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Gráficos próximamente
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recordatorios y Notificaciones
              </h3>
              <div className="h-64 flex flex-col justify-center items-center space-y-4">
                {stats.overdueLoans > 0 ? (
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      Tienes {stats.overdueLoans} préstamo(s) vencido(s)
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Por favor, devuelve los elementos lo antes posible
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      ¡Todos tus préstamos están al día!
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Excelente gestión de tus préstamos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
