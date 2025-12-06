import {colors} from '@/theme/colors'

export const formItemStyle = {
  '.MuiFormHelperText-contained': {
    color: 'black !important',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    // tie helper texty su nejaky body2 spany vnorene do tohto containeru helperText containeru...
    // asi sa to da vyriesit aj lepsie, priamym targetovanim MUI stylu
    '& > span': {
      fontStyle: 'unset',
    },
  },
  '.MuiInputLabel-root.Mui-error': {
    color: colors.white,
  },
  '.MuiInputLabel-root.MuiInputLabel-shrink': {
    color: colors.black,
    fontWeight: 'bold',
    background: colors.white,
    padding: '0 10px 0 5px',
    marginLeft: '-1px',
  },
  '.MuiInputLabel-root.MuiInputLabel-shrink.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  '.MuiOutlinedInput-root': {
    borderRadius: 0,
  },
  '.MuiOutlinedInput-root.Mui-error': {
    color: colors.white,
    background: colors.black,
  },
  '.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.black,
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderWidth: '5px',
    borderColor: colors.black,
    fontWeight: 'bold',
  },
}
