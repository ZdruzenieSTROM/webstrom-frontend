import {FC} from 'react'
import {DateTimeInput, DateTimeInputProps} from 'react-admin'

export const MyDateTimeInput: FC<DateTimeInputProps> = ({source, ...rest}) => (
  <DateTimeInput source={source} helperText={'Please provide time in Europe/Bratislava timezone'} {...rest} />
)
