import {DateTime} from 'luxon'
import {ComponentProps, FC} from 'react'
import {DateInput} from 'react-admin'

const backendFormat = 'dd.MM.yyyy HH:mm:ss'

// used to convert BE weird format of 01.01.2020 18:00:00 to 01-01-2020 input format
// https://moment.github.io/luxon/#/formatting
const dateFormatter = (v: string) => DateTime.fromFormat(v, backendFormat).toISODate()

// used to convert input format of 01-01-2020 to 01-01-2020TT00:00:00.000+02:00 BE-expected format
// https://moment.github.io/luxon/#/parsing
const dateParser = (v: string) => DateTime.fromISO(v).toISO()

export const MyDateInput: FC<ComponentProps<typeof DateInput>> = (props) => (
  <DateInput format={dateFormatter} parse={dateParser} {...props} />
)
