import {DateTime} from 'luxon'

export enum DateFormat {
  TIME = 'HH:mm',
  DATE = 'dd. LLL yyyy',
  DATE_TIME = 'dd. MM. yyyy HH:mm',
  DATE_DIGITS = 'dd. MM. yyyy',
}

export const formatDateTime = (date: string) => DateTime.fromISO(date).toFormat(DateFormat.DATE_TIME)
export const formatDate = (date: string) => DateTime.fromISO(date).toFormat(DateFormat.DATE)
export const formatDateDigits = (date: string) => DateTime.fromISO(date).toFormat(DateFormat.DATE_DIGITS)

export function formatDateTimeInterval(date1: string, date2: string) {
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)

  if (dateTime1.equals(dateTime2)) return formatDateDigits(date1)

  if (dateTime1.startOf('day').equals(dateTime2.startOf('day')))
    return `${dateTime1.toFormat(DateFormat.DATE_DIGITS)} ${dateTime1.toFormat(DateFormat.TIME)} - ${dateTime2.toFormat(
      DateFormat.TIME,
    )}`

  return `${dateTime1.toFormat(DateFormat.DATE_TIME)} - ${dateTime2.toFormat(DateFormat.DATE_TIME)}`
}
