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

const getArchiveButtonSx = (disabled = false): SxProps<Theme> => {
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
  }
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
export const ArchiveButton: FC<{
  kind: ButtonKind
  href?: string
  label?: string
}> = ({kind, href, label}) => {
  return (
    <Link variant="button2" disabled={!href} href={href} sx={getArchiveButtonSx(!href)}>
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
}> = ({label, children, indented = false, gap = 0.5, labelVariant = 'h3'}) => {
  return (
    <Stack
      className="archive-row"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
      sx={{
        pl: indented ? 3 : 1,
        pr: 1,
        py: 0.5,
        '&:hover': {
          bgcolor: colors.black,
          color: colors.white,
        },
      }}
    >
      <Typography variant={labelVariant}>{label}</Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="flex-end" gap={gap}>
        {children}
      </Stack>
    </Stack>
  )
}
