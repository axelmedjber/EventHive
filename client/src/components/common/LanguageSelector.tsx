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

/**
 * Simple language selector component that supports switching between English and French
 */
export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);
    setLanguage(value);
  };

  // Debug: log when the component renders with the current language
  useEffect(() => {
    console.log("Language change in LanguageSelector:", currentLanguage);
  }, [currentLanguage]);

  // Get the current language name for display
  const currentLanguageName = currentLanguage === 'fr' ? 'Français' : 'English';

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
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;