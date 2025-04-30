import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

// Get API key from environment variable
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// Log translation configuration
if (API_KEY) {
  console.log('Translation API key available');
} else {
  console.error('No Google Translate API key available');
}

// Helper function to simulate translations for development
const simulateTranslation = (text: string | string[], targetLanguage: string): string | string[] => {
  const prefixes: Record<string, string> = {
    'es': '[ES] ',
    'fr': '[FR] ',
    'de': '[DE] ',
    'zh': '[ZH] ',
    'ja': '[JA] ',
    'ar': '[AR] ',
    'ru': '[RU] ',
  };
  
  const prefix = prefixes[targetLanguage] || `[${targetLanguage.toUpperCase()}] `;
  
  if (Array.isArray(text)) {
    return text.map(t => `${prefix}${t}`);
  }
  
  return `${prefix}${text}`;
};

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
];

/**
 * Translates text to the target language
 */
export const translateText = async (
  text: string | string[],
  targetLanguageCode: string,
  sourceLanguageCode: string = 'en'
): Promise<string | string[]> => {
  // If target language is the same as source, no need to translate
  if (targetLanguageCode === sourceLanguageCode) {
    return text;
  }
  
  // Don't translate empty text
  if (Array.isArray(text) && text.length === 0) return [];
  if (!Array.isArray(text) && !text) return text;

  try {
    // If we have an API key, try to use the Google Translate API
    if (API_KEY) {
      try {
        const url = 'https://translation.googleapis.com/language/translate/v2';
        
        // For array of texts, join with a special delimiter that won't likely be in the text
        const textToTranslate = Array.isArray(text) ? text.join('||SPLIT||') : text;

        const response = await axios.post(
          url,
          {},
          {
            params: {
              q: textToTranslate,
              target: targetLanguageCode,
              source: sourceLanguageCode,
              format: 'text',
              key: API_KEY
            }
          }
        );

        if (response.data && response.data.data && response.data.data.translations) {
          const translatedText = response.data.data.translations[0].translatedText;
          
          // If original was array, split back into array
          if (Array.isArray(text)) {
            return translatedText.split('||SPLIT||');
          }
          
          return translatedText;
        }
      } catch (apiError) {
        console.error('Google Translate API error:', apiError);
        // Fallback to simulated translation if API call fails
        return simulateTranslation(text, targetLanguageCode);
      }
    }
    
    // If no API key or error with API, use simulated translations for development
    return simulateTranslation(text, targetLanguageCode);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to simulated translations for development
    return simulateTranslation(text, targetLanguageCode);
  }
};

// Cache translations to reduce API calls
const translationCache: Record<string, string> = {};

/**
 * Translates text with caching to reduce API calls
 */
export const translateWithCache = async (
  text: string,
  targetLanguageCode: string,
  sourceLanguageCode: string = 'en'
): Promise<string> => {
  // If target language is the same as source, no need to translate
  if (targetLanguageCode === sourceLanguageCode || !text) {
    return text;
  }

  // Generate a cache key
  const cacheKey = `${sourceLanguageCode}:${targetLanguageCode}:${text}`;

  // Check if translation is in cache
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const translatedText = await translateText(text, targetLanguageCode, sourceLanguageCode) as string;
    
    // Cache the result
    translationCache[cacheKey] = translatedText;
    
    return translatedText;
  } catch (error) {
    console.error('Error translating with cache:', error);
    return text;
  }
};