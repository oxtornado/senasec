import React, { useState, useEffect } from "react";
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Calendar, AlertTriangle, CheckCircle, User, Shield } from "lucide-react";
import { getInventoryItems } from "../services/inventory";
import { getLoans } from "../services/loans";
import { getCurrentUser } from "../services/auth";
import WeeklySchedule from "./WeeklySchedule";

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex items-center border border-gray-200/50 dark:border-gray-700/50`}
    >
      <div className={`p-4 rounded-2xl ${color} mr-6 shadow-lg`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {title}
        </p>
        <p className="text-6xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useLanguage();
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
        if (!currentUser.rol === "admin") {
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
          totalItems: currentUser.rol === "admin" ? items.length : filteredLoans.length,
          availableItems: currentUser.rol === "admin" ? availableItems : 0,
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
        <p className="text-red-500">{t('userLoadError')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-6">
      {/* Header con información del usuario */}
      <div className="bg-gradient-to-r from-white to-slate-50 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-2xl shadow-lg ${
              currentUser.rol === "admin" ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              {currentUser.rol === "admin" ? (
                <Shield className="h-10 w-10 text-white" />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">
                {t("dashboard")}
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300">
                {t('welcome')}, {currentUser.full_name} ({currentUser.rol === "admin" ? t('administrator') : t('standardUser')})
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
            currentUser.rol === "admin" 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}>
            {currentUser.rol === "admin" ? t('admin') : t('user')}
          </div>
        </div>
      </div>

      {/* Estadísticas diferenciadas por tipo de usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUser.rol === "admin" ? (
          // Vista de Administrador - Estadísticas completas del sistema
          <>
            <StatCard
              title={t('totalElements')}
              value={stats.totalItems}
              icon={Package}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title={t('availableElements')}
              value={stats.availableItems}
              icon={CheckCircle}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title={t('activeLoans')}
              value={stats.activeLoans}
              icon={Calendar}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title={t('overdueLoans')}
              value={stats.overdueLoans}
              icon={AlertTriangle}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
          </>
        ) : (
          // Vista de Usuario Estándar - Solo sus préstamos
          <>
            <StatCard
              title={t('myActiveLoans')}
              value={stats.activeLoans}
              icon={Calendar}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title={t('myOverdueLoans')}
              value={stats.overdueLoans}
              icon={AlertTriangle}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <StatCard
              title={t('totalMyLoans')}
              value={stats.totalItems}
              icon={Package}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title={t('status')}
              value={stats.overdueLoans > 0 ? t('attention') : t('upToDate')}
              icon={stats.overdueLoans > 0 ? AlertTriangle : CheckCircle}
              color={stats.overdueLoans > 0 ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-green-500 to-green-600"}
            />
          </>
        )}
      </div>

      {/* Programación Semanal - Siempre visible para debug */}
      <div className="mb-6">
        <WeeklySchedule />
      </div>

      {/* Gráficos y información adicional diferenciada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentUser.rol === "admin" ? (
          // Vista de Administrador - Gráficos del sistema completo
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('generalInventoryStatus')}
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('completeSystemInventoryView')}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t('chartsComingSoon')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('systemLoansTrend')}
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('allLoansAnalysis')}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t('chartsComingSoon')}
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
                {t('myLoansHistory')}
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('personalLoansHistory')}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t('chartsComingSoon')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('remindersNotifications')}
              </h3>
              <div className="h-64 flex flex-col justify-center items-center space-y-4">
                {stats.overdueLoans > 0 ? (
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      {t('youHaveOverdueLoans').replace('{{count}}', stats.overdueLoans)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('pleaseReturnItems')}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {t('allLoansUpToDate')}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('excellentLoanManagement')}
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