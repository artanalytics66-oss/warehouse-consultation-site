import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ArticleCard from '@/components/ArticleCard';

interface Article {
  id: number;
  title: string;
  category: string;
  short_description: string;
  full_content: string;
  image_url?: string;
  created_at?: string;
}

const API_URL = 'https://www.skladconsulting.ru/admin/api.php';

const Index = () => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedArticles, setExpandedArticles] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Консультации в складской логистике | Глубокая заморозка';
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setArticles([]);
  };

  const toggleArticle = (id: number) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'services', 'articles', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: `Телефон: ${formData.get('phone')}\n\n${formData.get('message')}`
    };

    try {
      const response = await fetch('https://functions.poehali.dev/7d4f8353-a5c0-4c4d-9360-f776bb10a0aa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });
        form.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg md:text-2xl font-heading font-bold text-secondary leading-tight">
                Профессиональная консультация в складской логистике
              </h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                Складская логистика продуктов глубокой заморозки
              </p>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  activeSection === 'about' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Обо мне
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === 'services' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection('articles')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === 'articles' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Статьи
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === 'contact' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Контакты
              </button>
              <Button onClick={() => scrollToSection('contact')} size="sm" className="text-xs px-3 py-2">
                Записаться на консультацию
              </Button>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed top-[73px] right-0 bottom-0 w-64 bg-white shadow-xl p-6 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-left py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                  activeSection === 'about' ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
              >
                О нас
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`text-left py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                  activeSection === 'services' ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection('articles')}
                className={`text-left py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                  activeSection === 'articles' ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
              >
                Статьи
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-left py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                  activeSection === 'contact' ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
              >
                Контакты
              </button>
              <Button onClick={() => scrollToSection('contact')} size="sm" className="mt-4 w-full">
                Записаться на консультацию
              </Button>
            </nav>
          </div>
        </div>
      )}

      <section
        id="about"
        className="pt-24 md:pt-32 pb-12 md:pb-20 px-4"
        style={{
          backgroundImage: 'linear-gradient(rgba(245, 247, 250, 0.95), rgba(245, 247, 250, 0.95)), url(https://cdn.poehali.dev/projects/5a8ac4f2-e421-48be-88da-a92f22758e9f/files/3068ff5d-259c-4893-9bcb-a8dbb7616cdc.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img
                src="https://cdn.poehali.dev/files/372331ad-87f0-4f9c-95ad-62204d767cf6.jpg"
                alt="Современный складской комплекс"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">
                Обо мне
              </h2>
              <p className="text-base md:text-lg text-foreground mb-6 leading-relaxed">
                18+ лет опыта в проектировании и оптимизации низкотемпературных складов (–20 °C…+5 °C). 
                Консультирую по выбору оборудования, внедрению WMS, автоматизации товарных потоков и мотивации персонала.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-secondary mb-4">
                  Ключевые результаты:
                </h3>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-foreground">
                    Спроектировал 6 специализированных складских комплексов под хранение пищевой продукции глубокой заморозки.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-foreground">
                    Внедрил WMS в тесном взаимодействии с проектной организацией: обучил команду, настроил оборудование и оптимизировал маршрутизацию товарных потоков.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-foreground">
                    Запустил KPI и сдельную оплату — сократил издержки и повысил скорость и точность отгрузок.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Что я предлагаю?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Комплексные консультационные услуги для оптимизации вашего бизнеса
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon name="Snowflake" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Глубокая заморозка
                </h3>
                <p className="text-sm md:text-base text-foreground leading-relaxed mb-6">
                  Консультации по выбору оборудования, созданию холодильных зон и оптимизации энергопотребления.
                </p>
                <Button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="w-full"
                >
                  Заказать консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon name="Building2" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Строительство склада
                </h3>
                <p className="text-sm md:text-base text-foreground leading-relaxed mb-6">
                  Расчет зон приемки, разгрузки, тамбуров, камер хранения, комплектации и технических помещений с учетом материалов, и автоматизации для эффективной работы в холоде.
                </p>
                <Button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="w-full"
                >
                  Заказать консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon name="LineChart" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Комплексная консультация
                </h3>
                <p className="text-sm md:text-base text-foreground leading-relaxed mb-6">
                  Анализ текущих процессов и разработка стратегии развития складской логистики 
                  с учетом бюджета и сроков.
                </p>
                <Button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="w-full"
                >
                  Заказать консультацию
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section 
        className="py-12 md:py-20 px-4"
        style={{
          backgroundColor: 'rgba(175, 219, 253, 0.5)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Как я работаю?
            </h2>
            <p className="text-lg text-muted-foreground">
              Процесс решения вопросов состоит из нескольких этапов:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 scroll-fade-in delay-1">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://cdn.poehali.dev/files/71312aac-812f-4dde-b7fc-300a4e2d5b8c.jpeg)',
                  opacity: 0.15
                }}
              />
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardContent className="relative p-8 pt-20">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Анализ потребностей
                </h3>
                <p className="text-foreground leading-relaxed">
                  Провожу удалённую консультацию с заказчиком для глубокого понимания его задач в области складской логистики и формулирования чётких требований.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 scroll-fade-in delay-2">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://cdn.poehali.dev/files/a616b12c-5d03-4178-b1cb-9379e648631b.jpg)',
                  opacity: 0.15
                }}
              />
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardContent className="relative p-8 pt-20">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Оперативное предложение
                </h3>
                <p className="text-foreground leading-relaxed">
                  На основе полученных данных разрабатываю предварительное решение и направляю заказчику в течение 24 часов.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 scroll-fade-in delay-3">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://cdn.poehali.dev/files/72862d23-53dd-436d-9eea-d90121519bf8.jpeg)',
                  opacity: 0.15
                }}
              />
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardContent className="relative p-8 pt-20">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-4">
                  Реализация
                </h3>
                <p className="text-foreground leading-relaxed">
                  После согласования и оплаты утверждённого варианта предоставляю детальную презентацию с пошаговым планом внедрения решения.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="articles"
        className="py-12 md:py-20 px-4"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(https://cdn.poehali.dev/files/5404bcef-57f5-41da-b8af-43577a237bd8.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Полезные материалы по теме
            </h2>
            <p className="text-lg" style={{ color: '#3d2007' }}>
              Статьи о складской логистике глубокой заморозки и не только.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Свяжитесь со мной
            </h2>
          </div>

          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input id="name" name="name" placeholder="Иван Иванов" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="example@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Опишите вашу задачу или вопрос..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Отправить запрос
                  <Icon name="Send" className="ml-2" size={18} />
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" className="text-primary" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-secondary">Адрес</p>
                    <p className="text-sm text-foreground">г. Екатеринбург</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="text-primary" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-secondary">Телефон</p>
                    <p className="text-sm text-foreground">+79126734195</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" className="text-primary" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-secondary">Email</p>
                    <p className="text-sm text-foreground">artanalytics66@gmail.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">
                Консультации в складской логистике
              </h3>
              <p className="text-white/80">
                Профессиональные услуги в области глубокой заморозки и строительства складов
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Навигация</h4>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  Обо мне
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  Услуги
                </button>
                <button
                  onClick={() => scrollToSection('articles')}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  Статьи
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  Контакты
                </button>
              </nav>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-white/80">
                <p>+79126734195</p>
                <p>artanalytics66@gmail.com</p>
                <p>г. Екатеринбург</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2024 | Консультации в складской логистике. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;