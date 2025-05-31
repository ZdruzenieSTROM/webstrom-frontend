import {CircularProgress, Stack} from '@mui/material'
import {FC} from 'react'

type LoadingProps = {
  fullScreen?: boolean
}

export const Loading: FC<LoadingProps> = ({fullScreen = false}) => {
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        height: fullScreen ? '100dvh' : undefined,
      }}
    >
      <CircularProgress color="inherit" />
    </Stack>
  )
}
