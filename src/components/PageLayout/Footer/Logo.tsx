import {Box} from '@mui/material'
import NextLink from 'next/link'
import {FC} from 'react'

import {isExternalLink} from '@/components/Clickable/isExternalLink'

export interface ILogo {
  id: number
  name: string
  disabled: string
  image: string
  url: string | null
}

export const Logo: FC<ILogo> = ({name, image, url}) => {
  const imageElement = (
    <Box
      component={'img'}
      src={image}
      alt={name}
      sx={{
        maxHeight: '4rem',
      }}
    />
  )

  if (!url || !url.trim()) {
    return imageElement
  }

  const trimmedUrl = url.trim()
  const isExternal = isExternalLink(trimmedUrl)

  return (
    <Box component={isExternal ? 'a' : NextLink} href={trimmedUrl} sx={{display: 'inline-flex'}}>
      {imageElement}
    </Box>
  )
}
