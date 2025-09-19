import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lng: 'es' | 'en') => {
    console.log('=== LANGUAGE SELECTOR CLICK ===');
    console.log('Cambiando de', language, 'a', lng);
    setLanguage(lng);
  };

  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLanguageChange('es');
        }}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'es'
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        }`}
        style={{ pointerEvents: 'auto', zIndex: 1000 }}
      >
        ES
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLanguageChange('en');
        }}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'en'
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        }`}
        style={{ pointerEvents: 'auto', zIndex: 1000 }}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;