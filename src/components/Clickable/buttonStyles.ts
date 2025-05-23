import {SxProps, Theme} from '@mui/material'

import {colors} from '@/colors'

export const getButtonWrapperSx = ({
  invertColors,
  disabled,
  active,
}: {
  invertColors?: boolean
  disabled?: boolean
  active?: boolean
}) => {
  const invert = !!invertColors !== !!active

  return {
    display: 'inline-flex',
    cursor: disabled ? 'default' : 'pointer',
    // reset default <button> styles
    padding: 0,
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
        },
    px: '10px',
    pb: '4px',
  } satisfies SxProps<Theme>
}

export const buttonInnerSx = {
  borderBottom: '5px solid',
  alignItems: 'center',
} satisfies SxProps<Theme>
