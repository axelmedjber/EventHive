import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/translation/LanguageContext';
import { supportedLanguages } from '@/lib/translation/translationService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowRight } from 'lucide-react';

const TranslationDemo: React.FC = () => {
  const { translateText, currentLanguage, isLoading } = useLanguage();
  const [inputText, setInputText] = useState<string>('Hello! Welcome to EventHub. Find and attend events that match your interests.');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // When language changes, translate the demo text
  useEffect(() => {
    if (inputText && currentLanguage !== 'en') {
      handleTranslate();
    } else if (currentLanguage === 'en') {
      setTranslatedText('');
    }
  }, [currentLanguage]);

  const handleTranslate = async () => {
    if (!inputText) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText(inputText);
      setTranslatedText(result as string);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>Translation Demo</CardTitle>
        </div>
        <CardDescription>
          Try our real-time translation powered by Google Cloud Translation. Select a language from the dropdown in the header.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Badge variant="outline" className="mb-2">English</Badge>
            <Textarea 
              placeholder="Enter text to translate..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          {currentLanguage !== 'en' && (
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          {currentLanguage !== 'en' && (
            <div>
              <Badge variant="outline" className="mb-2">
                {supportedLanguages.find(lang => lang.code === currentLanguage)?.name || currentLanguage}
              </Badge>
              <Textarea 
                readOnly
                value={translatedText}
                className="min-h-[100px]"
                placeholder={isTranslating ? 'Translating...' : 'Translation will appear here...'}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTranslate} 
          disabled={isTranslating || currentLanguage === 'en' || !inputText}
          className="w-full"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationDemo;