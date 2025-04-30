import { v4 as uuidv4 } from 'uuid';

// Type definitions for API responses
interface TranslateTextResponse {
  translatedText: string | string[];
}

interface TranslateObjectResponse<T> {
  translatedObject: T;
}

// Helper function to make API requests
const apiCall = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
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
 * Translates text to the target language using our translation API endpoint
 */
export const translateText = async (
  text: string | string[],
  targetLanguageCode: string,
  sourceLanguageCode: string = 'en'
): Promise<string | string[]> => {
  try {
    // Don't translate empty text
    if (Array.isArray(text) && text.length === 0) return [];
    if (!Array.isArray(text) && !text) return text;
    
    // If target language is the same as source, no need to translate
    if (targetLanguageCode === sourceLanguageCode) {
      return text;
    }
    
    // Call our server-side translation endpoint
    const data = await apiCall('/api/translations/translate', {
      text,
      targetLanguage: targetLanguageCode,
      sourceLanguage: sourceLanguageCode
    });
    
    if (data && data.translatedText) {
      return data.translatedText;
    }
    
    // Return original text if no translation available
    return Array.isArray(text) ? text : text;
  } catch (error) {
    console.error('Translation error:', error);
    return Array.isArray(text) ? text : text;
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

/**
 * Batch translates an object's string properties
 */
export const translateObject = async<T extends Record<string, any>>(
  obj: T,
  targetLanguageCode: string,
  sourceLanguageCode: string = 'en'
): Promise<T> => {
  // If target language is the same as source, no need to translate
  if (targetLanguageCode === sourceLanguageCode) {
    return obj;
  }

  try {
    // Call our server-side object translation endpoint
    const data = await apiCall('/api/translations/translate-object', {
      object: obj,
      targetLanguage: targetLanguageCode,
      sourceLanguage: sourceLanguageCode
    });
    
    if (data && data.translatedObject) {
      return data.translatedObject;
    }
    
    return obj;
  } catch (error) {
    console.error('Error translating object:', error);
    return obj;
  }
};