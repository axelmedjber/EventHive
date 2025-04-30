import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';
import { Badge } from '@/components/ui/badge';
import TranslatedText from './TranslatedText';

interface LanguageMoodDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  showLabel?: boolean;
  showEmoji?: boolean;
  animate?: boolean;
}

/**
 * A component that displays the current language mood in various formats
 * Can be used throughout the application to create a consistent language theme
 */
export const LanguageMoodDisplay: React.FC<LanguageMoodDisplayProps> = ({
  size = 'md',
  variant = 'default',
  showLabel = true,
  showEmoji = true,
  animate = true
}) => {
  const { currentLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Language-specific mood indicators
  const moodData = {
    'en': {
      emoji: '🫖',
      phrase: 'Cheerio!',
      moodLabel: 'English Vibes'
    },
    'fr': {
      emoji: '🥖',
      phrase: 'Bonjour!',
      moodLabel: 'French Vibes'
    }
  };
  
  // Get time-of-day specific emoji
  const getTimeBasedEmoji = () => {
    const hour = new Date().getHours();
    
    if (currentLanguage === 'en') {
      if (hour >= 20 || hour < 6) return '🌙';  // Night
      if (hour >= 6 && hour < 12) return '☕';   // Morning
      if (hour >= 12 && hour < 17) return '🫖';  // Afternoon
      return '🍽️';  // Evening
    } else if (currentLanguage === 'fr') {
      if (hour >= 20 || hour < 6) return '✨';   // Night
      if (hour >= 6 && hour < 12) return '🥐';   // Morning
      if (hour >= 12 && hour < 17) return '🥖';  // Afternoon
      return '🍷';  // Evening
    }
    
    return '🌍'; // Default
  };
  
  // Current mood data based on language
  const currentMood = moodData[currentLanguage as keyof typeof moodData] || moodData['en'];
  const emoji = getTimeBasedEmoji();
  
  // Animation classes based on props
  const animationClass = animate ? 'animate-bounce' : '';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  // Add mounting effect for animations
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]}`}>
      {showEmoji && (
        <span className={`text-xl ${animationClass}`}>{emoji}</span>
      )}
      
      {showLabel && (
        <Badge variant={variant} className="font-medium">
          <TranslatedText text={currentMood.moodLabel} />
        </Badge>
      )}
    </div>
  );
};

export default LanguageMoodDisplay;