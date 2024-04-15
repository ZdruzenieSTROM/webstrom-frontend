import {Typography} from '@mui/material'
import {FC} from 'react'
import {DateField, FieldProps} from 'react-admin'

export const DateTimeField: FC<FieldProps> = ({source}) => (
  <>
    <DateField
      source={source}
      showTime={true}
      options={{
        timeZone: 'Europe/Bratislava',
        hourCycle: 'h24',
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }}
    />
    <Typography color={'#6F6F6F'} fontSize={'0.75em'}>
      Europe/Bratislava
    </Typography>
  </>
)
