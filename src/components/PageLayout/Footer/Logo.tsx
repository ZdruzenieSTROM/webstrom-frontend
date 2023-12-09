import {Box} from '@mui/material'
import {FC} from 'react'

export interface ILogo {
  id: number
  name: string
  disabled: string
  image: string
}

export const Logo: FC<ILogo> = ({name, image}) => {
  return (
    <Box
      component={'img'}
      src={image}
      alt={name} // TODO: alt from backend
      sx={{
        maxHeight: '9rem',
      }}
    />
  )
}
