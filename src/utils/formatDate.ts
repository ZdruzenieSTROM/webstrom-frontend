import {DateTime} from 'luxon'

export const formatDateTime = (date: string) => DateTime.fromISO(date).toFormat('dd. MM. yyyy HH:mm')
export const formatDate = (date: string) => DateTime.fromISO(date).toFormat('dd. LLL yyyy')
export const formatDateDigits = (date: string) => DateTime.fromISO(date).toFormat('dd. MM. yyyy')

export function formatDateTimeInterval(date1: string, date2: string) {
  if (date1 === date2) return formatDateDigits(date1)
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)
  if (dateTime1 === dateTime2) return formatDate(date1)
  if (dateTime1.toFormat('dd.MM.yyyy') === dateTime2.toFormat('dd.MM.yyyy'))
    return `${dateTime1.toFormat('dd.MM.yyyy')} ${dateTime1.toFormat('HH:mm')} - ${dateTime2.toFormat('HH:mm')}`
  return `${formatDateTime(date1)} - ${formatDateTime(date2)}`
}
