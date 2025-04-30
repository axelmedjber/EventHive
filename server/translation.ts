// Simple translation module with hardcoded English and French translations
// No external API dependencies

// Dictionary of translations from English to French
const translations: Record<string, Record<string, string>> = {
  'fr': {
    // Common UI elements
    'Browse Events': 'Parcourir les événements',
    'Create Event': 'Créer un événement',
    'Dashboard': 'Tableau de bord',
    'Login': 'Connexion',
    'Logout': 'Déconnexion',
    'Sign up': 'S\'inscrire',
    'Search events': 'Rechercher des événements',
    'Menu': 'Menu',
    'Language': 'Langue',
    
    // Home page
    'Hello! Welcome to EventHub': 'Bonjour! Bienvenue sur EventHub',
    'Ready to discover amazing events?': 'Prêt à découvrir des événements incroyables?',
    'Join thousands of people attending events near you': 'Rejoignez des milliers de personnes participant à des événements près de chez vous',
    
    // Event related
    'Featured Events': 'Événements en vedette',
    'Categories': 'Catégories',
    'Popular Locations': 'Lieux populaires',
    'Upcoming Events': 'Événements à venir',
    'View All': 'Voir tout',
    'View Details': 'Voir les détails',
    'Register': 'S\'inscrire',
    'Registration': 'Inscription',
    'Tickets': 'Billets',
    'Location': 'Lieu',
    'Date': 'Date',
    'Time': 'Heure',
    'Organizer': 'Organisateur',
    'Description': 'Description',
    'Price': 'Prix',
    'Free': 'Gratuit',
    'Filter': 'Filtrer',
    'Sort by': 'Trier par',
    
    // Footer and misc
    'About Us': 'À propos de nous',
    'Contact': 'Contact',
    'Privacy Policy': 'Politique de confidentialité',
    'Terms of Service': 'Conditions d\'utilisation',
    'Copyright': 'Droits d\'auteur',
    'All rights reserved': 'Tous droits réservés',
    
    // Categories
    'Music': 'Musique',
    'Sports': 'Sports',
    'Arts': 'Arts',
    'Food': 'Nourriture',
    'Business': 'Affaires',
    'Technology': 'Technologie',
    'Workshops': 'Ateliers',
    'Conferences': 'Conférences',
    
    // Translation and language mood info
    'Multi-language Support': 'Support multilingue',
    'Translate to your preferred language': 'Traduire dans votre langue préférée',
    'Automatic UI Translation': 'Traduction automatique de l\'interface',
    'Powered by EventHub': 'Propulsé par EventHub',
    'Language Mood Indicators': 'Indicateurs d\'humeur linguistique',
    'English-French Translation': 'Traduction anglais-français',
    'Time-aware Emoji Moods': 'Humeurs emoji selon l\'heure',
    'Language Mood': 'Humeur linguistique',
    'Our application now shows emoji mood indicators that change based on the selected language and time of day.': 'Notre application affiche maintenant des indicateurs d\'humeur emoji qui changent en fonction de la langue sélectionnée et de l\'heure de la journée.',
    'Morning mood': 'Humeur matinale',
    'Afternoon mood': 'Humeur d\'après-midi',
    'English Vibes': 'Ambiance anglaise',
    'French Vibes': 'Ambiance française',
  }
};

// Only support English and French
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' }
];

/**
 * Translates text to the target language using a predefined dictionary
 */
export const translateText = async (
  text: string | string[],
  targetLanguageCode: string,
  sourceLanguageCode: string = 'en'
): Promise<string | string[]> => {
  // If target language is the same as source or not supported, return original text
  if (targetLanguageCode === sourceLanguageCode || targetLanguageCode !== 'fr') {
    return text;
  }
  
  // Don't translate empty text
  if (Array.isArray(text) && text.length === 0) return [];
  if (!Array.isArray(text) && !text) return text;

  try {
    // Handle array of texts
    if (Array.isArray(text)) {
      return text.map(item => translateSingleText(item, targetLanguageCode));
    }
    
    // Handle single text
    return translateSingleText(text, targetLanguageCode);
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Helper function to translate a single text string
function translateSingleText(text: string, targetLanguageCode: string): string {
  const langDict = translations[targetLanguageCode];
  
  if (!langDict) {
    console.log(`No translations available for language: ${targetLanguageCode}`);
    return text;
  }
  
  // Check if we have a direct translation
  if (langDict[text]) {
    console.log(`Found translation for: "${text}"`);
    return langDict[text];
  }
  
  // If no exact match, try to match sentence fragments
  // This is a very simple implementation - in production you'd use more sophisticated matching
  for (const [original, translated] of Object.entries(langDict)) {
    if (text.includes(original)) {
      const replacedText = text.replace(original, translated);
      console.log(`Partial match found for: "${original}" in "${text}"`);
      return replacedText;
    }
  }
  
  // If no translation found, return original with a language marker
  console.log(`No translation found for: "${text}"`);
  return `[FR] ${text}`;
}

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