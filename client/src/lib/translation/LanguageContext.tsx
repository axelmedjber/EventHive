import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { supportedLanguages, translateWithCache } from './translationService';

// Initialize i18next with empty resources (we'll use dynamic translations)
i18next
  .use(initReactI18next)
  .init({
    resources: {},
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  translateText: (text: string) => Promise<string>;
  isLoading: boolean;
  supportedLanguages: { code: string; name: string }[];
};

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translateText: async (text) => text,
  isLoading: false,
  supportedLanguages,
});

export const useLanguage = () => useContext(LanguageContext);

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useTranslation();

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Change the language
  const setLanguage = (code: string) => {
    if (supportedLanguages.some(lang => lang.code === code)) {
      setCurrentLanguage(code);
      i18n.changeLanguage(code);
      localStorage.setItem('preferredLanguage', code);
    }
  };

  // Translate text using Google Translate API
  const translateText = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'en') {
      return text;
    }

    setIsLoading(true);
    try {
      const translatedText = await translateWithCache(text, currentLanguage);
      setIsLoading(false);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      translateText,
      isLoading,
      supportedLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export a custom hook that translates text automatically
export const useTranslateText = (text: string): string => {
  const [translatedText, setTranslatedText] = useState(text);
  const { translateText, currentLanguage } = useLanguage();

  useEffect(() => {
    if (text && currentLanguage !== 'en') {
      let isMounted = true;
      translateText(text).then(result => {
        if (isMounted) {
          setTranslatedText(result);
        }
      });
      return () => { isMounted = false; };
    } else {
      setTranslatedText(text);
    }
  }, [text, translateText, currentLanguage]);

  return translatedText;
};