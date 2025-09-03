import { useEffect } from 'react';

// Utilidad para forzar actualización de componentes cuando cambia el idioma
export const useLanguageRefresh = () => {
  useEffect(() => {
    const handleLanguageChange = () => {
      // Forzar re-render de todos los componentes
      window.location.reload();
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
};

// Función para limpiar cache de traducciones
export const clearTranslationCache = () => {
  // Limpiar localStorage relacionado con traducciones
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('i18n') || key.includes('translation') || key.includes('language')) {
      localStorage.removeItem(key);
    }
  });
  
  // Forzar recarga completa
  window.location.reload();
};

// Función para detectar y reportar problemas de cache
export const debugTranslations = () => {
  console.log('=== DEBUG TRADUCCIONES ===');
  console.log('localStorage language:', localStorage.getItem('senasec-language'));
  console.log('Todas las claves localStorage:', Object.keys(localStorage));
  
  // Verificar si hay conflictos de cache
  const hasI18nCache = Object.keys(localStorage).some(key => 
    key.includes('i18n') || key.includes('translation')
  );
  
  if (hasI18nCache) {
    console.warn('DETECTADO: Cache de i18n que puede estar causando conflictos');
    return true;
  }
  
  return false;
};
