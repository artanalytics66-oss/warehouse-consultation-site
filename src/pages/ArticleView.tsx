import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  title: string;
  short_description: string;
  full_content: string;
  icon: string;
}

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://functions.poehali.dev/941f1118-e5bc-48a9-8a2d-ff4bd917dc4b?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Статья не найдена');
      }
      
      const data = await response.json();
      setArticle(data);
      document.title = `${data.title} | Складская логистика`;
    } catch (err) {
      setError('Не удалось загрузить статью');
      console.error('Failed to load article:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="AlertCircle" className="text-destructive mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold mb-2">Статья не найдена</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
              <Icon name={article.icon} className="text-primary" size={48} fallback="FileText" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6 text-center">
            {article.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
              {article.short_description}
            </p>

            <div className="text-foreground space-y-2">
              {formatContent(article.full_content)}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-secondary text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Складская логистика. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleView;