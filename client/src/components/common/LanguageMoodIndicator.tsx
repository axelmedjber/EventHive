import React from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LanguageEmoji {
  emoji: string;
  label: string;
  description: string;
}

/**
 * A fun component that displays an emoji representing the "mood" of the current language
 */
export const LanguageMoodIndicator: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  // Define language-specific emojis and their meanings with personality
  const languageEmojis: Record<string, LanguageEmoji> = {
    'en': {
      emoji: '🫖',
      label: 'English Mood',
      description: 'Feeling proper and orderly with a cup of tea. Quite right!'
    },
    'fr': {
      emoji: '🥖',
      label: 'French Mood',
      description: 'Feeling sophisticated with a touch of romance. C\'est magnifique!'
    }
  };
  
  // Additional mood changes based on the time of day
  const hour = new Date().getHours();
  if (hour >= 20 || hour < 6) {
    // Night mood
    languageEmojis['en'].emoji = '🌙';
    languageEmojis['en'].description = 'Enjoying a peaceful evening with a good book';
    languageEmojis['fr'].emoji = '✨';
    languageEmojis['fr'].description = 'La nuit est magique et pleine de possibilités';
  } else if (hour >= 6 && hour < 12) {
    // Morning mood
    languageEmojis['en'].emoji = '☕';
    languageEmojis['en'].description = 'Starting the day with a proper breakfast';
    languageEmojis['fr'].emoji = '🥐';
    languageEmojis['fr'].description = 'Bonjour! Un croissant pour commencer la journée';
  }
  
  // Get the emoji data for the current language (default to English if not found)
  const emojiData = languageEmojis[currentLanguage] || languageEmojis['en'];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-2xl cursor-help transition-all duration-300 hover:scale-125">
            {emojiData.emoji}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{emojiData.label}</p>
            <p className="text-sm">{emojiData.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageMoodIndicator;