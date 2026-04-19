import {FC} from 'react'
import {DateTimeInput, DateTimeInputProps} from 'react-admin'

import {dateTimeInputFormat, dateTimeInputParse} from '@/utils/dateTimeInputIso'

export const MyDateTimeInput: FC<DateTimeInputProps> = ({source, ...rest}) => (
  <DateTimeInput
    source={source}
    helperText={'Časy uvádzaj v časovom pásme Europe/Bratislava'}
    // ked user vojde napr. do editu competition/event, React Admin vola `format`,
    // aby naplnil interne hodnoty inputov.
    // 1. najprv to vola s BE hodnotou, ktora je v UTC (konci 'Z').
    // 2. RA ale vola potom `format` znovu s aktualnou internou hodnotou,
    // preto `format` musi podporovat oba formaty a vzdy vratit to iste.
    format={dateTimeInputFormat}
    parse={dateTimeInputParse}
    {...rest}
  />
)
