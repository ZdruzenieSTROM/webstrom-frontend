import {SxProps, Theme} from '@mui/material'

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
    '--bgcolor': invert ? 'black' : 'white',
    '--color': disabled ? '#ccc' : invert ? 'white' : 'black',
    '&:hover': active
      ? {}
      : {
          '--bgcolor': disabled ? '#ccc' : invert ? 'white' : 'black',
          '--color': disabled ? 'white' : invert ? 'black' : 'white',
        },
    px: '10px',
    pb: '4px',
  } satisfies SxProps<Theme>
}

export const buttonInnerSx = {
  borderBottom: '5px solid',
  alignItems: 'center',
} satisfies SxProps<Theme>
