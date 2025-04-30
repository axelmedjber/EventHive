import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { TranslationServiceClient } from '@google-cloud/translate';

// Service account credentials
const CREDENTIALS_FILE = './google-credentials.json';

// Initialize the translation client with service account credentials
let translationClient: TranslationServiceClient | null = null;

try {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    translationClient = new TranslationServiceClient({
      keyFilename: CREDENTIALS_FILE
    });
    console.log('Translation service client initialized with service account credentials');
  } else {
    console.error('Service account credentials file not found:', CREDENTIALS_FILE);
  }
} catch (error) {
  console.error('Error initializing translation client:', error);
}

// Keep API key as fallback
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
if (API_KEY) {
  console.log('Translation API key available as fallback');
}

// Helper function to simulate translations for development
const simulateTranslation = (text: string | string[], targetLanguage: string): string | string[] => {
  // Define language indicators with correct language names
  const languageNames: Record<string, string> = {
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'zh': '中文',
    'ja': '日本語',
    'ar': 'العربية',
    'ru': 'Русский',
  };
  
  // Create more obvious translations for testing
  const formatTranslation = (t: string) => {
    const langName = languageNames[targetLanguage] || targetLanguage.toUpperCase();
    
    // Make the translations very obvious by adding clear language markers
    switch(targetLanguage) {
      case 'es':
        return `ESPAÑOL: ${t}`;
      case 'fr':
        return `FRANÇAIS: ${t}`;
      case 'de':
        return `DEUTSCH: ${t}`;
      case 'zh':
        return `中文: ${t}`;
      case 'ja':
        return `日本語: ${t}`;
      case 'ar':
        return `العربية: ${t}`;
      case 'ru':
        return `РУССКИЙ: ${t}`;
      default:
        return `${langName.toUpperCase()}: ${t}`;
    }
  };
  
  if (Array.isArray(text)) {
    return text.map(t => formatTranslation(t));
  }
  
  return formatTranslation(text);
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
    // Try using the service account client first (most secure method)
    if (translationClient) {
      try {
        console.log('Attempting translation with service account credentials');
        
        // Prepare texts for translation
        const textToTranslate = Array.isArray(text) ? text : [text];
        const projectId = 'artful-cipher-458411-n6';
        const location = 'global';
        
        const request = {
          parent: `projects/${projectId}/locations/${location}`,
          contents: textToTranslate,
          mimeType: 'text/plain',
          sourceLanguageCode: sourceLanguageCode,
          targetLanguageCode: targetLanguageCode,
        };
        
        // Make the translation request
        const [response] = await translationClient.translateText(request);
        
        if (response.translations && response.translations.length > 0) {
          console.log('Successfully translated text with service account');
          
          // Extract translated text
          const translations = response.translations.map(t => t.translatedText || '');
          
          // Return as array or single string based on input
          if (Array.isArray(text)) {
            return translations;
          } else {
            return translations[0];
          }
        }
      } catch (serviceError) {
        console.error('Service account translation error:', serviceError);
        // If service account method fails, try API key method next
      }
    }
    
    // Fallback to API key method if service account failed or isn't available
    if (API_KEY) {
      try {
        const url = 'https://translation.googleapis.com/language/translate/v2';
        
        // For array of texts, join with a special delimiter that won't likely be in the text
        const textToTranslate = Array.isArray(text) ? text.join('||SPLIT||') : text;

        console.log('Falling back to API key translation method');
        console.log('Translating text to:', targetLanguageCode, 'from:', sourceLanguageCode);
        
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
          console.log('Successfully translated text with API key');
          
          // If original was array, split back into array
          if (Array.isArray(text)) {
            return translatedText.split('||SPLIT||');
          }
          
          return translatedText;
        }
      } catch (apiError: any) {
        // Log more detailed error information
        console.error('API key translation error details:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data
        });
      }
    }
    
    // If all translation methods failed or aren't available, use simulated translations
    console.log('All translation methods failed, using simulated translation');
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