import {
  AssignmentOutlined,
  AssignmentTurnedInOutlined,
  EmojiEventsOutlined,
  MenuBookOutlined,
  PhotoLibraryOutlined,
} from '@mui/icons-material'
import {Box, Stack, SvgIconProps, SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import {ComponentType, FC, ReactNode} from 'react'

import {colors} from '@/theme/colors'

import {Link} from '../Clickable/Link'

const getArchiveButtonSx = (disabled = false) => {
  return {
    '.archive-row:hover &': {
      '--bgcolor': colors.black,
      '--color': disabled ? colors.gray : colors.white,
      bgcolor: colors.black,
      color: disabled ? colors.gray : colors.white,
    },
    '.archive-row:hover &:hover': {
      '--bgcolor': disabled ? colors.gray : colors.white,
      '--color': disabled ? colors.white : colors.black,
      bgcolor: disabled ? colors.gray : colors.white,
      color: disabled ? colors.white : colors.black,
    },
  } satisfies SxProps<Theme>
}

type ButtonKind = 'magazine' | 'results' | 'problems' | 'solutions' | 'photos'

const buttonConfig: Record<ButtonKind, {label: string; Icon: ComponentType<SvgIconProps>}> = {
  magazine: {label: 'Časopis', Icon: MenuBookOutlined},
  results: {label: 'Poradie', Icon: EmojiEventsOutlined},
  problems: {label: 'Zadania', Icon: AssignmentOutlined},
  solutions: {label: 'Riešenia', Icon: AssignmentTurnedInOutlined},
  photos: {label: 'Fotky', Icon: PhotoLibraryOutlined},
}

const ButtonContent: FC<{kind: ButtonKind; label?: string}> = ({kind, label}) => {
  const {label: defaultLabel, Icon} = buttonConfig[kind]
  return (
    <Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
      <Icon aria-hidden sx={{fontSize: '1em'}} />
      {label || defaultLabel}
    </Box>
  )
}

// Disabled (grey, not clickable) when there is no href.
// compact: narrower side padding on xs, so three buttons fit on one line of a 320px phone
export const ArchiveButton: FC<{
  kind: ButtonKind
  href?: string
  label?: string
  compact?: boolean
}> = ({kind, href, label, compact = false}) => {
  return (
    <Link
      variant="button2"
      disabled={!href}
      href={href}
      sx={{...getArchiveButtonSx(!href), ...(compact ? {px: {xs: '6px', sm: '10px'}} : {})}}
    >
      <ButtonContent kind={kind} label={label} />
    </Link>
  )
}

export const ArchiveRow: FC<{
  label: string
  children: ReactNode
  indented?: boolean
  gap?: number | string
  labelVariant?: TypographyProps['variant']
  sx?: SxProps<Theme>
  labelSx?: SxProps<Theme>
  buttonsSx?: SxProps<Theme>
}> = ({label, children, indented = false, gap = 0.5, labelVariant = 'h3', sx, labelSx, buttonsSx}) => {
  return (
    <Stack
      className="archive-row"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
      sx={[
        {
          pl: indented ? 3 : 1,
          pr: 1,
          py: 0.5,
          '&:hover': {
            bgcolor: colors.black,
            color: colors.white,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography variant={labelVariant} sx={labelSx}>
        {label}
      </Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="flex-end" gap={gap} sx={buttonsSx}>
        {children}
      </Stack>
    </Stack>
  )
}
