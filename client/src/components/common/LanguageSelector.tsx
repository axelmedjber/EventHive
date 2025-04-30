import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from '@/lib/translation/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Select language" />
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