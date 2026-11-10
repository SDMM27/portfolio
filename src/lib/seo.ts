import { languages, type Lang } from '../i18n/ui';

export type Alternates = Record<Lang, string>;

export const otherLang = (lang: Lang): Lang => languages.find((l) => l !== lang)!;
