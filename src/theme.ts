import {createTheme, Theme} from '@mui/material/styles'

// https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    button1: React.CSSProperties
    button2: React.CSSProperties
    button3: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    button1?: React.CSSProperties
    button2?: React.CSSProperties
    button3?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    button1: true
    button2: true
    button3: true
    // disable these variants
    h4: false
    h5: false
    h6: false
    button: false
    caption: false
    overline: false
    subtitle1: false
    subtitle2: false
  }
}

const _theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    // disable these variants
    h4: undefined,
    h5: undefined,
    h6: undefined,
    button: undefined,
    caption: undefined,
    overline: undefined,
    subtitle1: undefined,
    subtitle2: undefined,
  },
})

const pxToRem = _theme.typography.pxToRem
const sm = _theme.breakpoints.up('sm')
const md = _theme.breakpoints.up('md')
const lg = _theme.breakpoints.up('lg')
const xl = _theme.breakpoints.up('xl')

export const theme: Theme = {
  ..._theme,
  typography: {
    ..._theme.typography,
    h1: {
      fontSize: pxToRem(32),
      [sm]: {fontSize: pxToRem(36)},
      [md]: {fontSize: pxToRem(36)},
      [lg]: {fontSize: pxToRem(40)},
      [xl]: {fontSize: pxToRem(40)},
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    h2: {
      fontSize: pxToRem(22),
      [sm]: {fontSize: pxToRem(26)},
      [md]: {fontSize: pxToRem(26)},
      [lg]: {fontSize: pxToRem(30)},
      [xl]: {fontSize: pxToRem(30)},
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    h3: {
      fontSize: pxToRem(20),
      [sm]: {fontSize: pxToRem(22)},
      [md]: {fontSize: pxToRem(22)},
      [lg]: {fontSize: pxToRem(24)},
      [xl]: {fontSize: pxToRem(24)},
      textTransform: 'uppercase',
      fontWeight: 800,
    },
    body1: {
      fontSize: pxToRem(16),
      [sm]: {fontSize: pxToRem(18)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(20)},
      [xl]: {fontSize: pxToRem(20)},
    },
    body2: {
      fontSize: pxToRem(12),
      [sm]: {fontSize: pxToRem(14)},
      [md]: {fontSize: pxToRem(14)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(16)},
    },
    body3: {
      fontSize: pxToRem(12),
      [sm]: {fontSize: pxToRem(12)},
      [md]: {fontSize: pxToRem(12)},
      [lg]: {fontSize: pxToRem(12)},
      [xl]: {fontSize: pxToRem(12)},
    },
    button1: {
      fontSize: pxToRem(22),
      [sm]: {fontSize: pxToRem(26)},
      [md]: {fontSize: pxToRem(26)},
      [lg]: {fontSize: pxToRem(30)},
      [xl]: {fontSize: pxToRem(30)},
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    button2: {
      fontSize: pxToRem(16),
      [sm]: {fontSize: pxToRem(18)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(20)},
      [xl]: {fontSize: pxToRem(20)},
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    button3: {
      fontSize: pxToRem(10),
      [sm]: {fontSize: pxToRem(12)},
      [md]: {fontSize: pxToRem(12)},
      [lg]: {fontSize: pxToRem(14)},
      [xl]: {fontSize: pxToRem(14)},
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
  },
}
