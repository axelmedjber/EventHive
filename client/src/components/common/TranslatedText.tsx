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

  useEffect(() => {
    // No need to translate if language is English or text is empty
    if (!text || currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    // Translate the text
    const performTranslation = async () => {
      setIsLoading(true);
      try {
        const result = await translateText(text);
        setTranslatedText(result as string);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

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