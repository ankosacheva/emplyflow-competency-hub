/** Shared SEO constants for Hub prerender and client shell. */
export const ORIGIN = 'https://emplyflow.ru';
export const BASE = '/hub';
export const SITE_NAME = 'EmplyFlow';
export const THEME_COLOR = '#4a3bff';

/** Replace at build time or in index.html before deploy. */
export const GSC_VERIFICATION = '__GSC_TOKEN__';
export const YANDEX_VERIFICATION = '__YV_TOKEN__';
export const YM_COUNTER_ID = '__YM_ID__';

/** Stable IndexNow key (32 hex). File: /hub/indexnow-<key>.txt */
export const INDEXNOW_KEY = 'a7f3c9e2b1d0486f5e8a2c4d6b9f0e3a';

export const OG_IMAGES = {
  default: `${ORIGIN}${BASE}/assets/og-default.png`,
  article: `${ORIGIN}${BASE}/assets/og-article.png`,
};

export const FILTER_KEYS = [
  'competency',
  'role',
  'industry',
  'difficulty',
  'situation',
  'format',
  'duration',
];

export const FILTER_LABELS = {
  competency: 'Компетенция',
  role: 'Роль',
  industry: 'Отрасль',
  difficulty: 'Сложность',
  situation: 'Ситуация',
  format: 'Формат',
  duration: 'Длительность',
};
