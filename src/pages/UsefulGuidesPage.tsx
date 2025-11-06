import { Helmet } from 'react-helmet';
import {
  BookOpen,
  Info,
  Archive,
  Truck,
  Ruler,
  Shield,
  Zap,
  Search,
  AlertCircle,
  BatteryCharging,
  CalendarSearch,
  Divide,
  Snowflake,
  Star,
  Volume2,
  Wallet,
  Calendar,
  Car,
  Cog,
  Gauge,
  Settings,
  Tag,
  Wrench,
  ArrowRightLeft,
} from 'lucide-react';

const guides = [
  // Основи вибору шин
  {
    id: 'tyre-size-guide',
    title: 'Як правильно підібрати розмір шин',
    description: 'Гайд по підбору правильного розміру шин згідно з параметрами вашого авто.',
    icon: <Ruler className="w-6 h-6 text-cyan-600" />,
  },
  {
    id: 'dot-code-check',
    title: 'Як перевірити вік шин за DOT-кодом',
    description: 'Дізнайтесь дату виробництва шин і навчіться читати DOT-коди.',
    icon: <CalendarSearch className="w-6 h-6 text-emerald-600" />,
  },
  {
    id: 'how-to-check-tyre-wear',
    title: 'Як перевірити знос шин',
    description: 'Покрокова інструкція для перевірки протектора в домашніх умовах.',
    icon: <Search className="w-6 h-6 text-green-600" />,
  },
  {
    id: 'budget-vs-premium-tyres',
    title: 'Преміум vs бюджетні шини',
    description: 'Що краще — економія чи якість? Порівнюємо характеристики та вартість.',
    icon: <Divide className="w-6 h-6 text-purple-500" />,
  },
  {
    id: 'tyre-brand-rating-2025',
    title: 'Рейтинг брендів шин 2025',
    description: 'Огляд кращих брендів шин 2025 року — лідери якості та популярності.',
    icon: <Star className="w-6 h-6 text-yellow-500" />,
  },

  // Сезонність та типи шин
  {
    id: 'winter-vs-summer-tyres',
    title: 'Зимові vs літні шини: що вибрати?',
    description: 'Пояснення відмінностей сезонних шин і поради щодо вибору.',
    icon: <Zap className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'all-season-tyres-guide',
    title: 'Всесезонні шини — чи варто купувати?',
    description: 'Переваги та недоліки всесезонної гуми. Кому вона підходить?',
    icon: <BookOpen className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 'when-change-tyres',
    title: 'Коли міняти шини на зимові чи літні',
    description: 'Температурні пороги, законодавство та поради фахівців.',
    icon: <Snowflake className="w-6 h-6 text-blue-400" />,
  },

  // Спеціальні типи та сертифікації
  {
    id: 'runflat-tyres-guide',
    title: 'Що таке RunFlat шини',
    description: 'Все про RunFlat: як вони працюють і чи варто їх купувати.',
    icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
  },
  {
    id: 'tyre-homologation',
    title: 'Омологація шин: що це таке?',
    description: 'Навіщо потрібна сертифікація шин під конкретні моделі авто.',
    icon: <Info className="w-6 h-6 text-purple-600" />,
  },
  {
    id: 'ev-tyres-guide',
    title: 'Шини для електромобілів',
    description: 'Які особливості вибору шин для EV: шум, витрата енергії, довговічність.',
    icon: <BatteryCharging className="w-6 h-6 text-lime-500" />,
  },

  // Покупка/економія
  {
    id: 'used-tyres-guide',
    title: 'Чи варто купувати шини б/в',
    description: 'Плюси, мінуси та поради щодо покупки вживаних шин.',
    icon: <Shield className="w-6 h-6 text-yellow-600" />,
  },
  {
    id: 'tyre-saving-tips',
    title: 'Як зекономити на шинах',
    description: 'Лайфхаки та інструменти для пошуку вигідних цін на шини.',
    icon: <Wallet className="w-6 h-6 text-green-600" />,
  },

  // Обслуговування та транспортування
  {
    id: 'tyre-storage-guide',
    title: 'Як зберігати шини правильно',
    description: 'Поради зі зберігання шин у гаражі чи на балконі без втрати якості.',
    icon: <Archive className="w-6 h-6 text-gray-700" />,
  },
  {
    id: 'how-to-transport-tyres',
    title: 'Як перевозити шини',
    description: 'Безпечне транспортування шин — поради для авто і доставки.',
    icon: <Truck className="w-6 h-6 text-rose-600" />,
  },

  // Європейські маркування
  {
    id: 'tyre-eu-label',
    title: 'Що означає євроетикетка на шинах (EU label)',
    description: 'Зчеплення, шум і економічність — розбір головних індексів шин.',
    icon: <Volume2 className="w-6 h-6 text-indigo-500" />,
  },
  {
    id: 'tyre-for-car-types',
    title: 'Як вибрати шини для різних типів автомобілів',
    description: 'Поради з вибору шин для легкових, вантажівок, позашляховиків та спорткарів.',
    icon: <Car className="w-6 h-6 text-blue-600" />,
  },
  {
    id: 'load-speed-index-explained',
    title: 'Що таке індекси навантаження і швидкості на шинах',
    description: 'Розшифровка маркувань індексів навантаження і швидкості на шинах.',
    icon: <Gauge className="w-6 h-6 text-red-500" />,
  },
  {
    id: 'tyre-balancing-guide',
    title: 'Чи потрібно балансувати шини і як це робиться',
    description: 'Вплив балансування шин на комфорт і довговічність авто.',
    icon: <Settings className="w-6 h-6 text-green-600" />,
  },
  {
    id: 'tyre-repair-basics',
    title: 'Основи ремонту шин: як заклеїти та коли варто замінювати',
    description: 'Інструкції з ремонту шин при проколах і інших пошкодженнях.',
    icon: <Wrench className="w-6 h-6 text-yellow-600" />,
  },
  {
    id: 'radial-vs-bias-tyres',
    title: 'Порівняння радіальних і діагональних шин',
    description: 'Переваги та недоліки радіальних і діагональних шин.',
    icon: <ArrowRightLeft className="w-6 h-6 text-purple-500" />,
  },
  {
    id: 'winter-prep-checklist',
    title: 'Як підготувати автомобіль до зими: перевірка і заміна шин',
    description: 'Комплексний чек-лист підготовки авто до зимового сезону.',
    icon: <Snowflake className="w-6 h-6 text-blue-400" />,
  },
  {
    id: 'tyre-pressure-impact',
    title: 'Вплив неправильного тиску в шинах на безпеку та витрату палива',
    description: 'Чому важливо підтримувати правильний тиск у шинах.',
    icon: <Gauge className="w-6 h-6 text-teal-600" />,
  },
  {
    id: 'seasonality-and-allseason-tyres',
    title: 'Що таке сезонність шин і чи варто купувати всесезонні шини',
    description: 'Аналіз плюсів і мінусів сезонних і всесезонних шин.',
    icon: <Calendar className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 'tyre-marking-decoding',
    title: 'Як читати маркування на шинах: розшифровка основних позначень',
    description: 'Покрокове керівництво з розшифровки позначень на шинах.',
    icon: <Tag className="w-6 h-6 text-indigo-600" />,
  },
  {
    id: 'tyre-manufacturing-tech-2025',
    title: 'Технології виробництва шин: що нового в 2025 році',
    description: 'Огляд інноваційних матеріалів і конструкцій у шинах нового покоління.',
    icon: <Cog className="w-6 h-6 text-gray-700" />,
  },
];

function UsefulGuidesPage() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>Корисні статті про шини | Omega Auto</title>
        <meta
          name="description"
          content="Читайте експертні гайди про підбір, зберігання, перевірку та купівлю шин. Поради для водіїв від Omega Auto."
        />
        <meta property="og:title" content="Корисні статті про шини | Omega Auto" />
        <meta
          property="og:description"
          content="Поради та інструкції для водіїв щодо вибору шин, догляду та зберігання. Вибирайте краще разом з Omega Auto."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://omega-auto.vercel.app/guides" />
        <link rel="canonical" href="https://omega-auto.vercel.app/guides" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Корисні статті про шини | Omega Auto" />
        <meta
          name="twitter:description"
          content="Поради та інструкції для водіїв щодо вибору шин, догляду та зберігання. Вибирайте краще разом з Omega Auto."
        />
        <meta name="twitter:url" content="https://omega-auto.vercel.app/guides" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Корисні статті</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {guides.map(({ id, title, description, icon }) => (
          <a
            key={id}
            href={`/guides/${id}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 border rounded-lg hover:shadow-lg transition group bg-white"
          >
            <div className="flex-shrink-0">{icon}</div>

            <div>
              <h2 className="text-lg font-semibold text-cyan-700 group-hover:underline">{title}</h2>

              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

export default UsefulGuidesPage;
