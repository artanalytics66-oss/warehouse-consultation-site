import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedArticle1, setExpandedArticle1] = useState(false);
  const [expandedArticle2, setExpandedArticle2] = useState(false);
  const [expandedArticle3, setExpandedArticle3] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-heading font-bold text-secondary">
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
        className="pt-32 pb-20 px-4"
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
              <h2 className="text-4xl font-heading font-bold text-secondary mb-6">
                Обо мне
              </h2>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
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

      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
              Что я предлагаю?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Комплексные консультационные услуги для оптимизации вашего бизнеса
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon name="Snowflake" className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-secondary mb-4">
                  Глубокая заморозка
                </h3>
                <p className="text-foreground leading-relaxed mb-6">
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
                <h3 className="text-2xl font-heading font-bold text-secondary mb-4">
                  Строительство склада
                </h3>
                <p className="text-foreground leading-relaxed mb-6">
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
                <h3 className="text-2xl font-heading font-bold text-secondary mb-4">
                  Комплексная консультация
                </h3>
                <p className="text-foreground leading-relaxed mb-6">
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
        id="articles"
        className="py-20 px-4"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)), url(https://cdn.poehali.dev/projects/5a8ac4f2-e421-48be-88da-a92f22758e9f/files/a6eeb69a-b6ae-4800-9a13-eec075ec0522.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
              Полезные материалы по теме
            </h2>
            <p className="text-lg text-muted-foreground">
              Статьи о складской логистике глубокой заморозки и не только.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon name="FileText" className="text-primary" size={48} />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold text-secondary mb-3">
                  Общие положения для начала разработки низкотемпературного комплекса
                </h3>
                <div className="text-foreground mb-4 space-y-4 text-sm">
                  <p>
                    Для проектирования складского пространства с низкотемпературными зонами необходимо учесть специфику каждой функциональной области: приемка-разгрузка, переходные зоны, основная холодильная камера, зона комплектации и технические помещения.
                  </p>
                  
                  {expandedArticle1 && (
                    <div className="expand-animation">
                      <div>
                        <h4 className="font-semibold mb-2">Расчет площадей основных зон:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Зона приемки и разгрузки</strong> — примерно 20% от общей площади склада</li>
                          <li><strong>Переходные зоны (тамбуры)</strong> — барьер от холода, защита от влаги и снега, повышают безопасность и энергоэффективность</li>
                          <li><strong>Основная холодильная камера</strong> — расчет ведется исходя из массы товаров и требуемого пространства</li>
                          <li><strong>Зона комплектации</strong> — подготовка заказов, погрузочные платформы, упаковка</li>
                          <li><strong>Технические помещения</strong> — машинные отделения, электрооборудование, резервные источники</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Материалы и грузоподъемность:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Сэндвич-панели с высокой степенью изоляции</li>
                          <li>Влагостойкие полы, устойчивые к заморозке</li>
                          <li>Металлоконструкции с расчетом на тяжелые грузы и перепады температур</li>
                          <li>Запас грузоподъемности минимум 20% от расчетного веса</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Интеграция автоматизации:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>WMS-системы для управления складом</li>
                          <li>Контроль температуры и влажности</li>
                          <li>Автоматические ворота и электронные замки</li>
                          <li>Системы энергосбережения</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Особенности проектирования:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Четкое деление на температурные зоны с отдельным доступом</li>
                          <li>Ширина коридоров обычно 3,5 метра для работы на Рич траке</li>
                          <li>Высота подъема до 10 метров</li>
                          <li>Маршруты без пересечения потоков персонала, техники и товара</li>
                        </ul>
                      </div>
                      
                      <p className="text-muted-foreground italic">
                        Такой подход позволяет добиться энергоэффективности, безопасности и оптимальной производительности для склада любого размера в условиях низкотемпературного хранения.
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => setExpandedArticle1(!expandedArticle1)}
                >
                  {expandedArticle1 ? 'Свернуть' : 'Читать далее'} 
                  <Icon name={expandedArticle1 ? "ChevronUp" : "ArrowRight"} className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon name="Zap" className="text-primary" size={48} />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold text-secondary mb-3">
                  5 способов снизить энергопотребление холодильных камер
                </h3>
                <div className="text-foreground mb-4 space-y-4 text-sm">
                  <p>
                    Практические рекомендации по оптимизации энергопотребления и сокращению операционных расходов на 20-30%.
                  </p>
                  
                  {expandedArticle2 && (
                    <div className="expand-animation">
                      <div>
                        <h4 className="font-semibold mb-2">1. Правильная изоляция и герметизация</h4>
                        <p>Качественные сэндвич-панели и регулярная проверка уплотнителей дверей снижают теплопотери на 15-20%. Устраняйте щели и повреждения изоляции немедленно.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">2. Оптимизация работы холодильного оборудования</h4>
                        <p>Регулярное техническое обслуживание компрессоров, очистка конденсаторов и испарителей, правильная настройка температурных режимов позволяют сэкономить до 25% энергии.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">3. Использование систем рекуперации тепла</h4>
                        <p>Утилизация тепла от холодильных установок для обогрева служебных помещений или подогрева воды снижает общие энергозатраты на 10-15%.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">4. Внедрение LED-освещения и датчиков движения</h4>
                        <p>Светодиодные светильники выделяют минимум тепла и потребляют в 5-8 раз меньше энергии. Автоматическое управление освещением экономит дополнительно 30-40%.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">5. Оптимизация логистики и потоков</h4>
                        <p>Минимизация времени открытия дверей, использование воздушных завес, правильная организация хранения для свободной циркуляции воздуха снижают нагрузку на оборудование на 10-15%.</p>
                      </div>
                      
                      <p className="text-muted-foreground italic">
                        Комплексное применение всех методов позволяет сократить энергопотребление на 30-40% и значительно снизить операционные расходы.
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => setExpandedArticle2(!expandedArticle2)}
                >
                  {expandedArticle2 ? 'Свернуть' : 'Читать далее'} 
                  <Icon name={expandedArticle2 ? "ChevronUp" : "ArrowRight"} className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon name="FileText" className="text-primary" size={48} />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold text-secondary mb-3">
                  ТР ТС 028/2012: ключевые требования для складов
                </h3>
                <div className="text-foreground mb-4 space-y-4 text-sm">
                  <p>
                    Разбор технического регламента Таможенного союза и практические советы по обеспечению соответствия нормативам при проектировании и эксплуатации холодильных складов.
                  </p>
                  
                  {expandedArticle3 && (
                    <div className="expand-animation">
                      <div>
                        <h4 className="font-semibold mb-2">Требования к помещениям</h4>
                        <p>Стены, полы и потолки должны быть выполнены из влагостойких материалов, устойчивых к воздействию низких температур. Поверхности должны легко очищаться и дезинфицироваться.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Температурный режим и контроль</h4>
                        <p>Обязательна установка систем автоматического контроля и регистрации температуры с архивированием данных. Для замороженной продукции температура не выше -18°C, для охлажденной — от 0 до +6°C.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Санитарные нормы</h4>
                        <p>Требуется раздельное хранение разных групп товаров, наличие санпропускников для персонала, регулярная дезинфекция помещений и оборудования, контроль за грызунами и насекомыми.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Вентиляция и освещение</h4>
                        <p>Система вентиляции должна обеспечивать равномерное распределение температуры. Освещенность в зонах комплектации — не менее 200 лк, в зонах хранения — не менее 50 лк.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Документация и сертификация</h4>
                        <p>Необходимо вести журналы учета температурного режима, проводить регулярные проверки оборудования, иметь действующие сертификаты соответствия на холодильное оборудование.</p>
                      </div>
                      
                      <p className="text-muted-foreground italic">
                        Соблюдение требований ТР ТС 028/2012 обязательно для получения разрешений на эксплуатацию и гарантирует безопасность хранимой продукции.
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => setExpandedArticle3(!expandedArticle3)}
                >
                  {expandedArticle3 ? 'Свернуть' : 'Читать далее'} 
                  <Icon name={expandedArticle3 ? "ChevronUp" : "ArrowRight"} className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
              Свяжитесь со мной
            </h2>
            <p className="text-lg text-muted-foreground">
              Получите бесплатную консультацию и PDF-буклет о ключевых ошибках при строительстве складов
            </p>
          </div>

          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input id="name" placeholder="Иван Иванов" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    placeholder="Опишите вашу задачу или вопрос..."
                    rows={5}
                    required
                  />
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                  <Icon name="Gift" className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-secondary mb-1">Бонус при отправке заявки!</p>
                    <p className="text-sm text-foreground">
                      Получите PDF-буклет "5 ключевых ошибок при строительстве складов с глубокой заморозкой"
                    </p>
                  </div>
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
                    <p className="text-sm text-foreground">+79126261717</p>
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
                  О нас
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
                <p>+7 (495) 123-45-67</p>
                <p>info@coldlogistics.ru</p>
                <p>г. Москва, ул. Промышленная, д. 10</p>
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