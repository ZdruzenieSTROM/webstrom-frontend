import {Box, SxProps} from '@mui/material'
import {FC} from 'react'

import Close from '@/svg/close.svg'

interface CloseButtonProps {
  onClick: () => void
  size: number
  invertColors?: boolean
  sx?: SxProps
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, size, invertColors, sx}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        padding: 0.5,
        ...(invertColors
          ? {
              color: 'black',
              background: 'white',
              '&.active, &:hover': {
                color: 'white',
                background: 'black',
              },
            }
          : {
              color: 'white',
              background: 'black',
              '&.active, &:hover': {
                color: 'black',
                background: 'white',
              },
            }),
        ...sx,
      }}
    >
      <Close width={size} height={size} />
    </Box>
  )
}
