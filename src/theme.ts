import {createTheme, Theme} from '@mui/material/styles'
import {Poppins} from 'next/font/google'

// https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    button1: React.CSSProperties
    button2: React.CSSProperties
    button3: React.CSSProperties
    postTitle: React.CSSProperties
    postBody: React.CSSProperties
    postDate: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    button1?: React.CSSProperties
    button2?: React.CSSProperties
    button3?: React.CSSProperties
    postTitle?: React.CSSProperties
    postBody?: React.CSSProperties
    postDate?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    button1: true
    button2: true
    button3: true
    postTitle: true
    postBody: true
    postDate: true
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
export const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
})

const _theme = createTheme({
  typography: {
    ...font.style,
    // disable these variants
    h4: undefined,
    h5: undefined,
    h6: undefined,
    button: undefined,
    caption: undefined,
    overline: undefined,
    subtitle1: undefined,
    subtitle2: undefined,
    h1: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    h2: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    h3: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
    },
    body1: {
      ...font.style,
      fontWeight: 400,
    },
    body2: {
      ...font.style,
      fontWeight: 400,
    },
    body3: {
      ...font.style,
      fontWeight: 400,
    },
    button1: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    button2: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    button3: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    postTitle: {
      ...font.style,
      fontWeight: 800,
    },
    postBody: {
      ...font.style,
      fontWeight: 400,
    },
    postDate: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 300,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body1: 'span',
          body2: 'span',
          body3: 'span',
          button1: 'span',
          button2: 'span',
          button3: 'span',
          postTitle: 'h1',
          postBody: 'span',
          postDate: 'span',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '& > div.MuiDialogContent-root': {paddingTop: '20px'},
          border: '10px solid black',
          width: '100%',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
        },
      },
    },
  },
})

const pxToRem = _theme.typography.pxToRem
const sm = _theme.breakpoints.up('sm') // 600px
const md = _theme.breakpoints.up('md') // 900px
const lg = _theme.breakpoints.up('lg') // 1200px
const xl = _theme.breakpoints.up('xl') // 1536px

// manual font sizes
export const theme: Theme = {
  ..._theme,
  typography: {
    ..._theme.typography,
    h1: {
      ..._theme.typography.h1,
      // original Figma fontSize: 40px
      fontSize: pxToRem(32),
      [sm]: {fontSize: pxToRem(32)},
      [md]: {fontSize: pxToRem(32)},
      [lg]: {fontSize: pxToRem(32)},
      [xl]: {fontSize: pxToRem(40)},
      lineHeight: 1.5,
    },
    h2: {
      ..._theme.typography.h2,
      // original Figma fontSize: 30px
      fontSize: pxToRem(24),
      [sm]: {fontSize: pxToRem(24)},
      [md]: {fontSize: pxToRem(24)},
      [lg]: {fontSize: pxToRem(24)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    h3: {
      ..._theme.typography.h3,
      // original Figma fontSize: 24px
      fontSize: pxToRem(18),
      [sm]: {fontSize: pxToRem(18)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(18)},
      [xl]: {fontSize: pxToRem(24)},
      lineHeight: 1.5,
    },
    body1: {
      ..._theme.typography.body1,
      // original Figma fontSize: 20px
      fontSize: pxToRem(14),
      [sm]: {fontSize: pxToRem(16)},
      [md]: {fontSize: pxToRem(16)},
      [lg]: {fontSize: pxToRem(18)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    body2: {
      ..._theme.typography.body2,
      // original Figma fontSize: 16px
      fontSize: pxToRem(10),
      [sm]: {fontSize: pxToRem(12)},
      [md]: {fontSize: pxToRem(12)},
      [lg]: {fontSize: pxToRem(14)},
      [xl]: {fontSize: pxToRem(16)},
      lineHeight: 1.5,
    },
    body3: {
      ..._theme.typography.body3,
      // original Figma fontSize: 12px
      fontSize: pxToRem(8),
      [sm]: {fontSize: pxToRem(8)},
      [md]: {fontSize: pxToRem(8)},
      [lg]: {fontSize: pxToRem(10)},
      [xl]: {fontSize: pxToRem(12)},
      lineHeight: 1.5,
    },
    button1: {
      ..._theme.typography.button1,
      // original Figma fontSize: 30px
      fontSize: pxToRem(24),
      [sm]: {fontSize: pxToRem(24)},
      [md]: {fontSize: pxToRem(24)},
      [lg]: {fontSize: pxToRem(24)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    button2: {
      ..._theme.typography.button2,
      // original Figma fontSize: 20px
      fontSize: pxToRem(14),
      [sm]: {fontSize: pxToRem(16)},
      [md]: {fontSize: pxToRem(16)},
      [lg]: {fontSize: pxToRem(18)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    button3: {
      ..._theme.typography.button3,
      // original Figma fontSize: 14px
      fontSize: pxToRem(10),
      [sm]: {fontSize: pxToRem(10)},
      [md]: {fontSize: pxToRem(10)},
      [lg]: {fontSize: pxToRem(12)},
      [xl]: {fontSize: pxToRem(14)},
      lineHeight: 1.5,
    },
    postTitle: {
      ..._theme.typography.postTitle,
      // original Figma fontSize: 36px
      fontSize: pxToRem(30),
      [sm]: {fontSize: pxToRem(30)},
      [md]: {fontSize: pxToRem(30)},
      [lg]: {fontSize: pxToRem(30)},
      [xl]: {fontSize: pxToRem(36)},
      lineHeight: 1.5,
    },
    postBody: {
      ..._theme.typography.postBody,
      // original Figma fontSize: 30px
      fontSize: pxToRem(24),
      [sm]: {fontSize: pxToRem(24)},
      [md]: {fontSize: pxToRem(24)},
      [lg]: {fontSize: pxToRem(24)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    postDate: {
      ..._theme.typography.postDate,
      // original Figma fontSize: 20px
      fontSize: pxToRem(14),
      [sm]: {fontSize: pxToRem(16)},
      [md]: {fontSize: pxToRem(16)},
      [lg]: {fontSize: pxToRem(18)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
  },
}
