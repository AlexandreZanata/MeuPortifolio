import { htmlLang, type Locale } from '@/i18n/config';

/** Formats an ISO date or `YYYY-MM` string as "November 2026" / "novembro de 2026". */
export function formatMonth(value: string, locale: Locale): string {
  const [year = '1970', month = '01'] = value.split('-');
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat(htmlLang[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Formats an ISO timestamp as "9 Nov 2026" / "9 de nov. de 2026". */
export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
