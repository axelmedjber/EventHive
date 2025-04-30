import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { translateText, translateWithCache, translateObject, supportedLanguages } from './translationService';

// Define the context structure
interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: typeof supportedLanguages;
  setLanguage: (lang: string) => void;
  translateText: typeof translateText;
  translateWithCache: typeof translateWithCache;
  translateObject: typeof translateObject;
  isLoading: boolean;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Set language and store in localStorage for persistence
  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  }, []);

  // Wrap translate functions to include current language
  const translateTextWithLang = useCallback(
    async (text: string | string[], targetLang?: string, sourceLang: string = 'en') => {
      setIsLoading(true);
      try {
        const result = await translateText(
          text,
          targetLang || currentLanguage,
          sourceLang
        );
        return result;
      } catch (error) {
        console.error('Translation error:', error);
        return text;
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage]
  );

  const translateWithCacheWithLang = useCallback(
    async (text: string, targetLang?: string, sourceLang: string = 'en') => {
      setIsLoading(true);
      try {
        const result = await translateWithCache(
          text,
          targetLang || currentLanguage,
          sourceLang
        );
        return result;
      } catch (error) {
        console.error('Cache translation error:', error);
        return text;
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage]
  );

  const translateObjectWithLang = useCallback(
    async <T extends Record<string, any>>(
      obj: T,
      targetLang?: string,
      sourceLang: string = 'en'
    ) => {
      setIsLoading(true);
      try {
        const result = await translateObject(
          obj,
          targetLang || currentLanguage,
          sourceLang
        );
        return result;
      } catch (error) {
        console.error('Object translation error:', error);
        return obj;
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage]
  );

  // Initialize language from localStorage on component mount
  React.useEffect(() => {
    const storedLang = localStorage.getItem('preferred_language');
    if (storedLang) {
      setCurrentLanguage(storedLang);
    }
  }, []);

  const contextValue: LanguageContextType = {
    currentLanguage,
    supportedLanguages,
    setLanguage,
    translateText: translateTextWithLang,
    translateWithCache: translateWithCacheWithLang,
    translateObject: translateObjectWithLang,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};