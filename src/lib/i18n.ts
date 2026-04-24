export type Locale = 'en' | 'ru';

export const translations = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_search: 'Search',
    nav_flights: 'Flights',
    nav_compare: 'Compare',
    nav_planner: 'Planner',
    nav_pricing: 'Pricing',
    nav_upgrade: 'Upgrade',

    // Hero
    hero_tag: 'AI-Powered Travel Intelligence',
    hero_title: 'Your Top 20',
    hero_title2: 'Travel Decisions',
    hero_sub: 'Flights, safety scores, visa intelligence, health advice and complete trip plans — ranked in seconds.',
    hero_cta: 'Find Top 20',
    hero_placeholder: 'e.g. "Cheapest Almaty to Da Nang June, no China transit"',
    hero_stats_results: 'Ranked results',
    hero_stats_modules: 'Data modules',
    hero_stats_countries: 'Countries',

    // Search
    search_from: 'Flying from',
    search_to: 'Destination',
    search_budget: 'Budget (USD)',
    search_date: 'Depart date',
    search_return: 'Return date',
    search_travelers: 'Travelers',
    search_cabin: 'Cabin',
    search_add_leg: '+ Add flight leg',
    search_direct: 'Direct flights only',
    search_no_transit: 'Exclude transit via:',
    search_quick: 'Quick Search',
    search_advanced: 'Advanced',
    search_multicity: 'Multi-City',
    search_cta: 'Find My Top 20',
    search_examples: 'Try:',

    // Results
    results_showing: 'Showing',
    results_of: 'of',
    results_destinations: 'destinations',
    results_upgrade_cta: 'Upgrade to unlock all 20',
    results_sort_score: 'Overall score',
    results_sort_price: 'Cheapest first',
    results_sort_safety: 'Safest first',

    // Modules
    module_safety: 'Travel Safety',
    module_visa: 'Visa Requirements',
    module_health: 'Health & Medicine',
    module_weather: 'Weather',
    module_culture: 'Culture & Language',
    module_sim: 'SIM & Connectivity',
    module_flights: 'Flights',
    module_hotels: 'Hotels',
    module_explore: 'Explore',

    // Safety levels
    safety_safe: 'Safe',
    safety_caution: 'Exercise Caution',
    safety_high_risk: 'High Risk',
    safety_do_not_travel: 'Do Not Travel',

    // Visa
    visa_free: 'Visa Free',
    visa_evisa: 'eVisa',
    visa_embassy: 'Embassy Required',

    // Flight
    flight_book: 'Book Now',
    flight_unlock: 'Unlock to Book',
    flight_direct: 'Direct',
    flight_stops: 'stop',
    flight_stops_plural: 'stops',

    // Disclaimers
    disclaimer_health: 'General travel health information only. Not personalised medical advice. Consult a travel health clinic before travel.',
    disclaimer_safety: "Verify with your government's official travel advisory before travel.",
    disclaimer_visa: 'Visa requirements change. Verify with the relevant embassy before travel.',
    disclaimer_ai: 'AI-generated. Verify with official sources before travel.',
    disclaimer_price: 'Prices are estimates. Final price confirmed at booking.',

    // Pricing
    pricing_title: 'Simple, honest pricing',
    pricing_sub: 'Start free. Upgrade when you need the full picture.',
    pricing_free: 'Free',
    pricing_basic: 'Basic',
    pricing_pro: 'Pro',
    pricing_forever: '/forever',
    pricing_month: '/month',
    pricing_cta_free: 'Get started free',
    pricing_cta_basic: 'Start Basic',
    pricing_cta_pro: 'Start Pro',
    pricing_pay_kaspi: 'Pay with Kaspi',
    pricing_pay_card: 'Pay with Card',

    // SIM
    sim_best_value: 'Best value',
    sim_recommended: 'Recommended',
    sim_buy: 'Buy →',
    sim_compare: 'Compare plans',
    sim_bundle: 'Trip bundle',
    sim_bundle_save: 'You save',

    // Multi-city
    multicity_title: 'Multi-City Flight Builder',
    multicity_add_leg: 'Add destination',
    multicity_remove_leg: 'Remove',
    multicity_total: 'Estimated total',
    multicity_book_all: 'Plan full trip on Kiwi →',

    // General
    loading: 'Loading…',
    error_retry: 'Try Again',
    back: '← Back',
    share: 'Share',
    unlock: 'Unlock',
    upgrade: 'Upgrade',
    per_night: '/night',
    from_price: 'Flights from',
  },

  ru: {
    nav_home: 'Главная',
    nav_search: 'Поиск',
    nav_flights: 'Рейсы',
    nav_compare: 'Сравнение',
    nav_planner: 'Планировщик',
    nav_pricing: 'Тарифы',
    nav_upgrade: 'Улучшить',

    hero_tag: 'ИИ-платформа для путешествий',
    hero_title: 'Топ 20',
    hero_title2: 'направлений для вас',
    hero_sub: 'Рейсы, оценки безопасности, визовая информация, советы по здоровью — всё в одном месте.',
    hero_cta: 'Найти Топ 20',
    hero_placeholder: 'Например: "Дешёвые рейсы Алматы — Да Нанг в июне, без транзита через Китай"',
    hero_stats_results: 'Результатов',
    hero_stats_modules: 'Модулей данных',
    hero_stats_countries: 'Стран',

    search_from: 'Откуда',
    search_to: 'Куда',
    search_budget: 'Бюджет (USD)',
    search_date: 'Дата вылета',
    search_return: 'Дата возврата',
    search_travelers: 'Пассажиры',
    search_cabin: 'Класс',
    search_add_leg: '+ Добавить рейс',
    search_direct: 'Только прямые рейсы',
    search_no_transit: 'Исключить транзит через:',
    search_quick: 'Быстрый поиск',
    search_advanced: 'Расширенный',
    search_multicity: 'Несколько городов',
    search_cta: 'Найти мой Топ 20',
    search_examples: 'Попробуйте:',

    results_showing: 'Показано',
    results_of: 'из',
    results_destinations: 'направлений',
    results_upgrade_cta: 'Обновите тариф, чтобы увидеть все 20',
    results_sort_score: 'По рейтингу',
    results_sort_price: 'Дешевле',
    results_sort_safety: 'Безопаснее',

    module_safety: 'Безопасность',
    module_visa: 'Визовые требования',
    module_health: 'Здоровье и медицина',
    module_weather: 'Погода',
    module_culture: 'Культура и язык',
    module_sim: 'SIM и связь',
    module_flights: 'Рейсы',
    module_hotels: 'Отели',
    module_explore: 'Достопримечательности',

    safety_safe: 'Безопасно',
    safety_caution: 'Соблюдайте осторожность',
    safety_high_risk: 'Высокий риск',
    safety_do_not_travel: 'Не рекомендуется',

    visa_free: 'Без визы',
    visa_evisa: 'Электронная виза',
    visa_embassy: 'Нужна виза в посольстве',

    flight_book: 'Забронировать',
    flight_unlock: 'Разблокировать',
    flight_direct: 'Прямой',
    flight_stops: 'пересадка',
    flight_stops_plural: 'пересадки',

    disclaimer_health: 'Общая информация о здоровье в путешествиях. Не является медицинским советом. Проконсультируйтесь с врачом перед поездкой.',
    disclaimer_safety: 'Проверьте официальные рекомендации вашего правительства перед поездкой.',
    disclaimer_visa: 'Визовые требования меняются. Уточняйте в посольстве перед поездкой.',
    disclaimer_ai: 'Создано ИИ. Проверяйте с официальными источниками перед поездкой.',
    disclaimer_price: 'Цены приблизительные. Окончательная цена — при бронировании.',

    pricing_title: 'Простые и честные тарифы',
    pricing_sub: 'Начните бесплатно. Обновите, когда нужно.',
    pricing_free: 'Бесплатно',
    pricing_basic: 'Базовый',
    pricing_pro: 'Про',
    pricing_forever: '/навсегда',
    pricing_month: '/месяц',
    pricing_cta_free: 'Начать бесплатно',
    pricing_cta_basic: 'Выбрать Базовый',
    pricing_cta_pro: 'Выбрать Про',
    pricing_pay_kaspi: 'Оплатить через Kaspi',
    pricing_pay_card: 'Оплатить картой',

    sim_best_value: 'Лучшая цена',
    sim_recommended: 'Рекомендуем',
    sim_buy: 'Купить →',
    sim_compare: 'Сравнить тарифы',
    sim_bundle: 'Пакет для поездки',
    sim_bundle_save: 'Экономия',

    multicity_title: 'Маршрут из нескольких городов',
    multicity_add_leg: 'Добавить направление',
    multicity_remove_leg: 'Удалить',
    multicity_total: 'Примерная сумма',
    multicity_book_all: 'Спланировать поездку на Kiwi →',

    loading: 'Загрузка…',
    error_retry: 'Попробовать снова',
    back: '← Назад',
    share: 'Поделиться',
    unlock: 'Разблокировать',
    upgrade: 'Улучшить',
    per_night: '/ночь',
    from_price: 'Рейсы от',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, locale: Locale = 'en'): string {
  return translations[locale][key] || translations.en[key] || key;
}
