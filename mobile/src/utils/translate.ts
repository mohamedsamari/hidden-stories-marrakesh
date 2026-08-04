import { Language } from '@/contexts/language-context';

export function pickTranslation<T>(en: T, fr: T, language: Language): T {
  return language === 'fr' ? fr : en;
}
