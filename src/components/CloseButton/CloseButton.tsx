import {Box, SxProps} from '@mui/material'
import {FC} from 'react'

import Close from '@/svg/close.svg'
import {colors} from '@/theme/colors'

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
              color: colors.black,
              background: colors.white,
              '&.active, &:hover': {
                color: colors.white,
                background: colors.black,
              },
            }
          : {
              color: colors.white,
              background: colors.black,
              '&.active, &:hover': {
                color: colors.black,
                background: colors.white,
              },
            }),
        ...sx,
      }}
    >
      <Close width={size} height={size} />
    </Box>
  )
}
