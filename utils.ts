import { DateTime } from 'luxon';

export function formatDate(rawDate: string) {
  const dt = DateTime.fromISO(rawDate).setLocale('pt-BR');
  const formattedDate = dt.toFormat('dd/LL/yy');
  return formattedDate;
}
