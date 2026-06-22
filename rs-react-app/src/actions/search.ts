'use server';

import { redirect } from 'next/navigation';

export async function searchAction(
  _prevState: string,
  formData: FormData
): Promise<string> {
  const query = (formData.get('query') as string)?.trim() || '';
  const locale = (formData.get('locale') as string) || 'en';

  if (query) {
    redirect(`/${locale}?query=${encodeURIComponent(query)}&page=1`);
  }
  redirect(`/${locale}?page=1`);
}
