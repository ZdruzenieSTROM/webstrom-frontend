import {DateTime} from 'luxon'
import {DateInput} from 'react-admin'

// https://moment.github.io/luxon/#/formatting
const dateFormatter = (v: string) => DateTime.fromISO(v).toISODate()
// https://moment.github.io/luxon/#/parsing
const dateParser = (v: string) => DateTime.fromISO(v).toISO()

export const MyDateInput: typeof DateInput = (props) => (
  <DateInput format={dateFormatter} parse={dateParser} {...props} />
)
