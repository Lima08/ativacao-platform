import { DateTime } from 'luxon'

export function formatDate(rawDate: string, format = 'dd/LL/yyyy') {
  const dt = DateTime.fromISO(rawDate).setLocale('pt-BR')
  const formattedDate = dt.toFormat(format)
  return formattedDate !== 'Invalid DateTime' ? formattedDate : ''
}
