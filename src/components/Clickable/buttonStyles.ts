import {SxProps, Theme} from '@mui/material'

import {colors} from '@/theme/colors'

export const getButtonWrapperSx = ({
  invertColors,
  disabled,
  active,
  withoutPaddingChanges,
}: {
  invertColors?: boolean
  disabled?: boolean
  active?: boolean
  withoutPaddingChanges?: boolean
}) => {
  const invert = !!invertColors !== !!active

  return {
    display: 'inline-flex',
    cursor: disabled ? 'default' : 'pointer',
    // reset default <button> styles
    ...(withoutPaddingChanges ? undefined : {padding: 0}),
    border: 0,
    // nakoniec to nemusi byt napisane cez CSS vars, ale mame takto moznost napr. referovat farby v children elementoch
    bgcolor: 'var(--bgcolor)',
    color: 'var(--color)',
    borderColor: 'var(--color)',
    '--bgcolor': invert ? colors.black : colors.white,
    '--color': disabled ? colors.gray : invert ? colors.white : colors.black,
    '&:hover': active
      ? {}
      : {
          '--bgcolor': disabled ? colors.gray : invert ? colors.white : colors.black,
          '--color': disabled ? colors.white : invert ? colors.black : colors.white,
          bgcolor: disabled ? colors.gray : invert ? colors.white : colors.black,
          color: disabled ? colors.white : invert ? colors.black : colors.white,
        },
    ...(withoutPaddingChanges ? undefined : {px: '10px'}),
    ...(withoutPaddingChanges ? undefined : {pb: '4px'}),
  } satisfies SxProps<Theme>
}

export const buttonInnerSx = {
  borderBottom: '5px solid',
  alignItems: 'center',
} satisfies SxProps<Theme>
