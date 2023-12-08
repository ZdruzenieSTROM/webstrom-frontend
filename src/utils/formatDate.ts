import {DateTime} from 'luxon'

export const formatDateTime = (date: string) => DateTime.fromISO(date).toFormat('dd. MM. yyyy HH:mm')
export const formatDate = (date: string) => DateTime.fromISO(date).toFormat('dd. LLL yyyy')
