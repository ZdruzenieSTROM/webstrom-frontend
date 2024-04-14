import {SxProps, Theme} from '@mui/material'

export const buttonCommonSx = {
  cursor: 'pointer',
  padding: 0,
  border: 0,
  borderBottom: '5px solid black',
  color: 'black',
  bgcolor: 'white',
  '&:hover': {
    bgcolor: 'black',
    color: 'white',
  },
} satisfies SxProps<Theme>

export const buttonDisabledSx = {
  cursor: 'default',
  color: '#ccc',
  borderColor: '#ccc',
  '&:hover': {
    bgcolor: '#ccc',
    color: 'white',
  },
} satisfies SxProps<Theme>
