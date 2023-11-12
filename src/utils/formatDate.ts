import {DateTime} from 'luxon'

export const formatDate = (date: string) => DateTime.fromISO(date).toFormat('dd.MM.yyyy HH:mm')
