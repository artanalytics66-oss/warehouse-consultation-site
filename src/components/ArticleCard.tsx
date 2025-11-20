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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Icon name={article.icon} className="text-primary" size={48} fallback="FileText" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-heading font-bold text-secondary mb-3">
          {article.title}
        </h3>
        <div className="text-foreground mb-4 space-y-4 text-sm">
          <p>{article.short_description}</p>
          
          {expanded && (
            <div className="expand-animation mt-4 pt-4 border-t">
              <div 
                className="prose prose-sm max-w-none whitespace-pre-wrap"
                style={{ maxHeight: 'none' }}
              >
                {article.full_content}
              </div>
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