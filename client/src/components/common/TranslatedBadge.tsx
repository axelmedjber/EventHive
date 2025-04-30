import React from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import TranslatedText from './TranslatedText';

interface TranslatedBadgeProps extends BadgeProps {
  text: string;
}

/**
 * A Badge component that uses TranslatedText to provide translations
 */
const TranslatedBadge: React.FC<TranslatedBadgeProps> = ({ 
  text, 
  className = '', 
  ...props 
}) => {
  return (
    <Badge className={className} {...props}>
      <TranslatedText text={text} />
    </Badge>
  );
};

export default TranslatedBadge;