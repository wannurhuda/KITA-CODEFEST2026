import { cookies } from 'next/headers';
import { dictionaries, type Dict, type Locale } from './dict';

export function getLocale(): Locale {
  const v = cookies().get('kita_lang')?.value;
  return v === 'en' ? 'en' : 'ms'; // Bahasa Melayu is the default language
}

export function getDict(): Dict {
  return dictionaries[getLocale()];
}
