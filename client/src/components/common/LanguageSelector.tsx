import React from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[110px] h-8 border-none bg-transparent">
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