import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import TranslatedText from './TranslatedText';

interface TranslatedButtonProps extends ButtonProps {
  text: string;
}

/**
 * A Button component that uses TranslatedText to provide translations
 */
const TranslatedButton: React.FC<TranslatedButtonProps> = ({ 
  text, 
  className = '', 
  children,
  ...props 
}) => {
  // If children are provided, use them instead of translated text
  if (children) {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button className={className} {...props}>
      <TranslatedText text={text} />
    </Button>
  );
};

export default TranslatedButton;