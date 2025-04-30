import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';

interface TranslatedTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * A component that translates text based on the selected language
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { translateText, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // No longer need to clean up translation formatted on the server

  // Track language change events
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Language change detected in TranslatedText");
      performTranslation();
    };

    // Listen for the custom language-changed event
    document.body.addEventListener('language-changed', handleLanguageChange);

    // Clean up listener on unmount
    return () => {
      document.body.removeEventListener('language-changed', handleLanguageChange);
    };
  }, []);

  const performTranslation = async () => {
    // No need to translate if language is English or text is empty
    if (!text || currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(text, currentLanguage, 'en');
      // No cleanup needed as translations are already properly formatted
      setTranslatedText(result as string);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText(text); // Fallback to original text
    } finally {
      setIsLoading(false);
    }
  };

  // Translate when text or language changes
  useEffect(() => {
    performTranslation();
  }, [text, currentLanguage, translateText]);

  return (
    <Component className={className}>
      {isLoading ? (
        <span className="opacity-70">{text}</span>
      ) : (
        translatedText || text
      )}
    </Component>
  );
};

export default TranslatedText;