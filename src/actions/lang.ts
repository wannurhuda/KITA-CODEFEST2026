'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLang(locale: 'ms' | 'en') {
  cookies().set('kita_lang', locale === 'en' ? 'en' : 'ms', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  revalidatePath('/', 'layout');
}
