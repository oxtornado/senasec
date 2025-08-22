import { BarChart3 } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

const Reports = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('reportsDashboard')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('reportsDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('reportsDashboard')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('reportsComingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
