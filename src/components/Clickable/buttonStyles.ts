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
    display: 'flex',
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
  } satisfies SxProps<Theme>
}

export const buttonTextSx = {
  mx: '10px',
  mb: '4px',
  borderBottom: '5px solid',
} satisfies SxProps<Theme>
