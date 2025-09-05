import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();


  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        type="button"
        className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
          language === 'es' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
        }`}
        onClick={() => setLanguage('es')}
        style={{ pointerEvents: 'auto', zIndex: 1000 }}
      >
        ES
      </button>
      <button
        type="button"
        className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
          language === 'en' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
        }`}
        onClick={() => setLanguage('en')}
        style={{ pointerEvents: 'auto', zIndex: 1000 }}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
