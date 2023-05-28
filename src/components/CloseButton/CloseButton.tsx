import {Close} from '@mui/icons-material'
import {FC} from 'react'

interface CloseButtonProps {
  onClick: () => void
  size?: number
  alignRight?: boolean
  invertColors?: boolean
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, size, alignRight, invertColors}) => {
  return (
    <Close
      sx={[
        {
          fontSize: size,
          cursor: 'pointer',
          color: !invertColors ? 'white' : 'black',
          'active, :hover': {
            color: !invertColors ? 'black' : 'white',
            backgroundColor: !invertColors ? 'white' : 'black',
          },
        },
        !!alignRight && {position: 'absolute', right: '8px'},
      ]}
      onClick={onClick}
    />
  )
}
