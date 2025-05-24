import {DateTime} from 'luxon'
import {FC} from 'react'
import {DateTimeInput, DateTimeInputProps} from 'react-admin'

const TIMEZONE = 'Europe/Bratislava'

// BE format: 2002-05-31T22:59:00Z
// interny input format: 2002-06-01T00:59

// ked user vojde napr. do editu competition/event, React Admin vola `format`,
// aby naplnil interne hodnoty inputov.
// 1. najprv to vola s BE hodnotou, ktora je v UTC (konci 'Z').
// 2.RA ale vola potom `format` znovu s aktualnou internou hodnotou,
// preto `format` musi podporovat oba formaty a vzdy vratit to iste.
export const myDateTimeInputFormat = (value?: string) => {
  if (!value) return

  const isUTC = value.endsWith('Z')

  return DateTime.fromISO(value, {zone: isUTC ? 'utc' : TIMEZONE})
    .setZone(TIMEZONE)
    .toFormat("yyyy-MM-dd'T'HH:mm")
}

export const myDateTimeInputParse = (value?: string) => {
  if (!value) return

  return DateTime.fromISO(value, {zone: TIMEZONE}).toUTC().toISO()
}

export const MyDateTimeInput: FC<DateTimeInputProps> = ({source, ...rest}) => (
  <DateTimeInput
    source={source}
    helperText={'Please provide time in Europe/Bratislava timezone'}
    format={myDateTimeInputFormat}
    parse={myDateTimeInputParse}
    {...rest}
  />
)
