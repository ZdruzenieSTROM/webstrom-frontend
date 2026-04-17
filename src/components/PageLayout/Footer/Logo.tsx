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
  const hasUrl = url != null && url.trim() !== ''
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

  if (!hasUrl) {
    return imageElement
  }

  const isExternal = isExternalLink(url)

  return (
    <Box component={isExternal ? 'a' : NextLink} href={url} sx={{display: 'inline-flex'}}>
      {imageElement}
    </Box>
  )
}
