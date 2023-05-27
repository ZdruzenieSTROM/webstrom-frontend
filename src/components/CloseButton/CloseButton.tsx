import {Close} from '@mui/icons-material'
import {FC} from 'react'

interface CloseButtonProps {
  onClick: () => void
  size?: number
  alignRight?: boolean
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, size, alignRight}) => {
  return (
    <Close
      sx={[
        {
          fontSize: size,
          cursor: 'pointer',
          color: 'white',
          'active, :hover': {
            color: 'black',
            backgroundColor: 'white',
          },
        },
        !!alignRight && {position: 'absolute', right: '8px'},
      ]}
      onClick={onClick}
    />
  )
}
