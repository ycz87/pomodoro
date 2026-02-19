/**
 * i18n — 轻量多语言系统
 * Context + hook，无第三方依赖
 */
import { createContext, useContext } from 'react';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ru } from './locales/ru';
import type { Messages } from './types';

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru';
export type { Messages };

const locales: Record<Locale, Messages> = { zh, en, ja, ko, es, fr, de, ru };

const I18nContext = createContext<Messages>(en);

export const I18nProvider = I18nContext.Provider;

/** 获取当前语言的翻译文案 */
export function useI18n(): Messages {
  return useContext(I18nContext);
}

/** 根据 locale 获取对应的翻译字典 */
export function getMessages(locale: Locale): Messages {
  return locales[locale] ?? en;
}

/** 检测浏览器语言，返回最匹配的 locale */
export function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('ru')) return 'ru';
  // 默认英文（国际化优先）
  return 'en';
}
