import {SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import clsx from 'clsx'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import styles from './Clickable.module.scss'

type LinkProps = {
  href?: string
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
  sx?: SxProps<Theme>
} & Pick<ComponentProps<typeof NextLink>, 'target'>

export const Link: FC<LinkProps> = ({children, href, disabled, target, variant, sx}) => {
  // https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
  return disabled ? (
    <Typography
      variant={variant ?? 'button3'}
      component="a"
      className={clsx(styles.actionButton, styles.disabled)}
      aria-disabled
      role="link"
      sx={sx}
    >
      {children}
    </Typography>
  ) : (
    <Typography
      variant={variant ?? 'button3'}
      component={NextLink}
      href={href ?? ''}
      target={target}
      className={clsx(styles.actionButton)}
      sx={sx}
    >
      {children}
    </Typography>
  )
}
