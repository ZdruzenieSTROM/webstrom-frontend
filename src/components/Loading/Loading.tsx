import {CircularProgress, Stack} from '@mui/material'
import {FC} from 'react'

export const Loading: FC = () => {
  return (
    <Stack alignItems="center">
      <CircularProgress color="inherit" />
    </Stack>
  )
}
