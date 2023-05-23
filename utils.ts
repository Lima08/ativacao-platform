import { DateTime } from 'luxon';

export function formatDate(rawDate: string) {
  const dt = DateTime.fromISO(rawDate).setLocale('pt-BR');
  const formattedDate = dt.toFormat('dd/LL/yy');
  return formattedDate;
}

// just in case
export const ROLES:  Record<number, string> = {
  100: 'user',
  200: 'admin',
  300: 'superadmin',
}