import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    tariff: ''
  });
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date || !bookingForm.tariff) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setIsPaymentProcessing(true);

    try {
      const tariffPrices: Record<string, number> = {
        'standard': 12000,
        'premium': 20000,
        'exclusive': 50000
      };

      const amount = tariffPrices[bookingForm.tariff] || selectedModel?.price || 15000;

      const response = await fetch('https://functions.poehali.dev/c445b8a9-7664-4379-bc2a-737d8076b639', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          description: `Бронирование ${selectedModel?.name} - ${bookingForm.tariff}`,
          orderId: `order-${Date.now()}`
        })
      });

      const data = await response.json();

      if (response.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: 'Ошибка платежа',
          description: data.error || 'Не удалось создать платёж',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к платёжному сервису',
        variant: 'destructive'
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const models = [
    {
      id: 1,
      name: 'Анастасия',
      age: 23,
      image: 'https://cdn.poehali.dev/projects/9093266c-b545-4849-ab3d-e0a2a7e30045/files/13e6c7e2-a461-4c9e-8cca-bd21ade9b987.jpg',
      rating: 5,
      languages: ['Русский', 'English'],
      services: ['Свидания', 'Вечеринки', 'Деловые встречи'],
      price: 15000
    },
    {
      id: 2,
      name: 'Виктория',
      age: 25,
      image: 'https://cdn.poehali.dev/projects/9093266c-b545-4849-ab3d-e0a2a7e30045/files/76b0b348-a5cb-4f3b-85d5-da5b2452b474.jpg',
      rating: 5,
      languages: ['Русский', 'English', 'Français'],
      services: ['Свидания', 'Путешествия', 'Деловые встречи'],
      price: 20000
    },
    {
      id: 3,
      name: 'Дарья',
      age: 22,
      image: 'https://cdn.poehali.dev/projects/9093266c-b545-4849-ab3d-e0a2a7e30045/files/a4df7898-1a2d-44f7-be76-3990d2ff20b3.jpg',
      rating: 5,
      languages: ['Русский', 'English'],
      services: ['Свидания', 'Вечеринки'],
      price: 12000
    }
  ];

  const services = [
    {
      icon: 'Sparkles',
      title: 'Романтические свидания',
      description: 'Незабываемые вечера в лучших ресторанах города',
      duration: 'От 2 часов'
    },
    {
      icon: 'Plane',
      title: 'Путешествия',
      description: 'Сопровождение в деловых и развлекательных поездках',
      duration: 'От 1 дня'
    },
    {
      icon: 'Users',
      title: 'Деловые встречи',
      description: 'Презентабельное сопровождение на мероприятиях',
      duration: 'От 3 часов'
    },
    {
      icon: 'PartyPopper',
      title: 'Вечеринки и мероприятия',
      description: 'Яркое присутствие на любом торжестве',
      duration: 'От 4 часов'
    }
  ];

  const pricingPlans = [
    {
      title: 'Стандарт',
      price: '12 000',
      duration: '2 часа',
      features: ['Встреча в ресторане', 'Приятная беседа', 'Базовое сопровождение']
    },
    {
      title: 'Премиум',
      price: '20 000',
      duration: '4 часа',
      features: ['VIP ресторан', 'Любое мероприятие', 'Расширенное сопровождение', 'Индивидуальный подход'],
      featured: true
    },
    {
      title: 'Эксклюзив',
      price: '50 000',
      duration: '12 часов',
      features: ['Все включено', 'Путешествия', 'Полное сопровождение', 'VIP обслуживание', 'Персональный менеджер']
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Heart" className="text-primary" size={28} />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Elite Escort
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Каталог
            </a>
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Услуги
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Прайс
            </a>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Icon name="Phone" size={16} className="mr-2" />
              Связаться
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              Премиум-сервис сопровождения
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Незабываемые встречи
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                с элитными девушками
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Конфиденциальность, безопасность и высочайший уровень сервиса. Онлайн-оплата и проверенные компаньонки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg">
                <Icon name="Search" size={20} className="mr-2" />
                Смотреть каталог
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 text-lg">
                <Icon name="Shield" size={20} className="mr-2" />
                Гарантии
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши модели</h2>
            <p className="text-muted-foreground text-lg">Выберите идеальную спутницу для вашего вечера</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="premium">Премиум</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model, index) => (
                  <Card 
                    key={model.id} 
                    className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] animate-scale-in border-border/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={model.image} 
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className="bg-primary/90 backdrop-blur-sm">
                          <Icon name="Star" size={14} className="mr-1" />
                          {model.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold">{model.name}</h3>
                          <span className="text-muted-foreground">{model.age} лет</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mb-3">
                          {model.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="border-primary/30">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {model.services.slice(0, 2).map(service => (
                            <Badge key={service} variant="secondary" className="bg-secondary/20">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <div className="text-sm text-muted-foreground">От</div>
                          <div className="text-2xl font-bold text-primary">{model.price.toLocaleString()} ₽</div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                              onClick={() => setSelectedModel(model)}
                            >
                              Забронировать
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Бронирование встречи</DialogTitle>
                              <DialogDescription>
                                Заполните форму, и наш менеджер свяжется с вами для подтверждения
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <img 
                                  src={model.image} 
                                  alt={model.name}
                                  className="w-16 h-16 object-cover rounded-full"
                                />
                                <div>
                                  <div className="font-semibold">{model.name}</div>
                                  <div className="text-sm text-muted-foreground">{model.age} лет</div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <input 
                                  type="text" 
                                  placeholder="Ваше имя"
                                  value={bookingForm.name}
                                  onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                                />
                                <input 
                                  type="tel" 
                                  placeholder="Телефон"
                                  value={bookingForm.phone}
                                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                                />
                                <input 
                                  type="date" 
                                  value={bookingForm.date}
                                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                                />
                                <select 
                                  value={bookingForm.tariff}
                                  onChange={(e) => setBookingForm({...bookingForm, tariff: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                                >
                                  <option value="">Выберите тариф</option>
                                  <option value="standard">Стандарт - 2 часа (12 000 ₽)</option>
                                  <option value="premium">Премиум - 4 часа (20 000 ₽)</option>
                                  <option value="exclusive">Эксклюзив - 12 часов (50 000 ₽)</option>
                                </select>
                              </div>
                              <Button 
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                onClick={handlePayment}
                                disabled={isPaymentProcessing}
                              >
                                <Icon name="CreditCard" size={16} className="mr-2" />
                                {isPaymentProcessing ? 'Обработка...' : 'Оплатить онлайн'}
                              </Button>
                              <p className="text-xs text-center text-muted-foreground">
                                <Icon name="Shield" size={12} className="inline mr-1" />
                                Безопасная оплата через ЮKassa
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="premium">
              <div className="text-center py-20 text-muted-foreground">
                Фильтр в разработке
              </div>
            </TabsContent>
            <TabsContent value="vip">
              <div className="text-center py-20 text-muted-foreground">
                Фильтр в разработке
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-muted-foreground text-lg">Широкий спектр сопровождения для любого случая</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name={service.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                  <Badge variant="outline" className="border-primary/30">
                    {service.duration}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Прайс-лист</h2>
            <p className="text-muted-foreground text-lg">Прозрачные цены без скрытых платежей</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.featured 
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105' 
                    : 'border-border/50 hover:shadow-xl hover:scale-105'
                } animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-secondary text-white px-4 py-1 text-sm font-semibold">
                    Популярный
                  </div>
                )}
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                    <div className="text-4xl font-bold text-primary mb-1">
                      {plan.price} ₽
                    </div>
                    <div className="text-muted-foreground">{plan.duration}</div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="Check" size={18} className="text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.featured 
                        ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Выбрать тариф
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="Lock" size={32} className="text-primary" />
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="CreditCard" size={32} className="text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Ваша безопасность — наш приоритет</h2>
            <p className="text-lg text-muted-foreground">
              Все платежи проходят через защищенный шлюз с SSL-шифрованием. 
              Конфиденциальность гарантирована. Проверенные анкеты и реальные фото.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                <Icon name="ShieldCheck" size={16} className="mr-2" />
                SSL сертификат
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                <Icon name="UserCheck" size={16} className="mr-2" />
                Проверенные анкеты
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                <Icon name="Eye" size={16} className="mr-2" />
                Конфиденциальность
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="Heart" className="text-primary" size={24} />
                <span className="text-xl font-bold">Elite Escort</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Премиум-сервис сопровождения с гарантией конфиденциальности
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Каталог моделей</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Свидания</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Деловые встречи</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Путешествия</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Гарантии</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Конфиденциальность</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Связь</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-primary/30">
                  <Icon name="Phone" size={16} className="mr-2" />
                  +7 (999) 123-45-67
                </Button>
                <Button variant="outline" className="w-full justify-start border-primary/30">
                  <Icon name="Mail" size={16} className="mr-2" />
                  info@elite.com
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Elite Escort. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;