import {FC} from 'react'
import {DateField, FieldProps} from 'react-admin'

export const DateTimeField: FC<FieldProps> = ({source}) => (
  <DateField
    source={source}
    showTime={true}
    options={{
      timeZone: 'Europe/Bratislava',
      timeZoneName: 'short',
      hourCycle: 'h24',
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }}
  />
)
