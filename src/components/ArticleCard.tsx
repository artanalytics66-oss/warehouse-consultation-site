import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    short_description: string;
    full_content: string;
    icon: string;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    return content.split('\n').map((line, idx) => {
      if (!line.trim()) return <br key={idx} />;
      
      const numberedMatch = line.match(/^(\d+)\.\t(.+)$/);
      if (numberedMatch) {
        return (
          <div key={idx} className="mb-3 pl-0">
            <span className="font-semibold text-primary">{numberedMatch[1]}. </span>
            <span>{numberedMatch[2]}</span>
          </div>
        );
      }
      
      const bulletMatch = line.match(/^•\t(.+)$/);
      if (bulletMatch) {
        return (
          <div key={idx} className="mb-2 pl-4 flex">
            <span className="text-primary mr-2">•</span>
            <span>{bulletMatch[1]}</span>
          </div>
        );
      }
      
      if (urlRegex.test(line)) {
        const parts = line.split(urlRegex);
        return (
          <div key={idx} className="mb-2">
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                return (
                  <a 
                    key={i} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {part}
                  </a>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        );
      }
      
      return <p key={idx} className="mb-3">{line}</p>;
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Icon name={article.icon} className="text-primary" size={48} fallback="FileText" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-heading font-bold text-secondary mb-3">
          {article.title}
        </h3>
        <div className="text-foreground mb-4 text-sm">
          <p className="mb-4">{article.short_description}</p>
          
          {expanded && (
            <div className="expand-animation mt-4 pt-4 border-t space-y-2">
              {formatContent(article.full_content)}
            </div>
          )}
        </div>
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Свернуть' : 'Читать далее'} 
          <Icon name={expanded ? "ChevronUp" : "ArrowRight"} className="ml-2" size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;