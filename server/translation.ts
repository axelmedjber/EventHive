import { TranslationServiceClient } from '@google-cloud/translate';
import * as path from 'path';
import * as fs from 'fs';

// Create a client using provided credentials
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

let translationClient: TranslationServiceClient | null = null;

if (fs.existsSync(CREDENTIALS_PATH)) {
  try {
    translationClient = new TranslationServiceClient({
      keyFilename: CREDENTIALS_PATH
    });
  } catch (error) {
    console.error('Error initializing translation client:', error);
  }
} else {
  console.error(`Credentials file not found at ${CREDENTIALS_PATH}`);
}

// Get the project ID from credentials
const getProjectId = (): string => {
  try {
    if (fs.existsSync(CREDENTIALS_PATH)) {
      const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      return credentials.project_id;
    }
    return 'artful-cipher-458411-n6';
  } catch (error) {
    console.error('Error getting project ID:', error);
    return '';
  }
};

const projectId = getProjectId();
const location = 'global';

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
  if (!translationClient || !projectId) {
    console.error('Translation client or project ID not available');
    return Array.isArray(text) ? text : text;
  }

  try {
    // Handle arrays of text
    if (Array.isArray(text)) {
      if (text.length === 0) return [];
      
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: text,
        mimeType: 'text/plain',
        sourceLanguageCode,
        targetLanguageCode,
      };

      const [response] = await translationClient.translateText(request);
      
      if (!response.translations) {
        return text;
      }
      
      return response.translations.map(translation => translation.translatedText || '');
    } 
    // Handle single text string
    else {
      if (!text) return text;
      
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode,
        targetLanguageCode,
      };

      const [response] = await translationClient.translateText(request);
      
      if (!response.translations || response.translations.length === 0) {
        return text;
      }
      
      return response.translations[0].translatedText || text;
    }
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