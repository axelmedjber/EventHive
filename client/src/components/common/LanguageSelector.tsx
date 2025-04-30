import React, { useEffect } from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);
    // Don't reload the page - let React handle re-rendering
    setLanguage(value);
  };

  // Debug: log when the component renders with the current language
  useEffect(() => {
    console.log("LanguageSelector rendered with language:", currentLanguage);
  }, [currentLanguage]);

  // Find the current language name for display
  const currentLanguageName = supportedLanguages.find(
    lang => lang.code === currentLanguage
  )?.name || 'English';

  return (
    <div className="flex items-center gap-2 relative">
      <Globe className="h-4 w-4 text-primary" />
      <Badge variant="outline" className="text-xs py-0 px-1 mr-1">
        {currentLanguageName}
      </Badge>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-8 border border-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;