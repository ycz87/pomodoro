/**
 * i18n — 轻量多语言系统
 * Context + hook，无第三方依赖
 */
import { createContext, useContext } from 'react';
import { zh } from './locales/zh';
import { en } from './locales/en';
import type { Messages } from './types';

export type Locale = 'zh' | 'en';
export type { Messages };

const locales: Record<Locale, Messages> = { zh, en };

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
  // 默认英文（国际化优先）
  return 'en';
}
