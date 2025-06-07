import {createTheme, Theme} from '@mui/material/styles'
import {Poppins} from 'next/font/google'

import {colors} from './colors'

// https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    button1: React.CSSProperties
    button2: React.CSSProperties
    button3: React.CSSProperties
    seminarButton: React.CSSProperties
    inlineLink: React.CSSProperties
    postTitle: React.CSSProperties
    postBody: React.CSSProperties
    postDate: React.CSSProperties
    resultsOrder: React.CSSProperties
    resultsName: React.CSSProperties
    resultsSchool: React.CSSProperties
    resultsScore: React.CSSProperties
    resultsTotal: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    button1?: React.CSSProperties
    button2?: React.CSSProperties
    button3?: React.CSSProperties
    seminarButton?: React.CSSProperties
    inlineLink?: React.CSSProperties & {
      '&:hover'?: React.CSSProperties
    }
    postTitle?: React.CSSProperties
    postBody?: React.CSSProperties
    postDate?: React.CSSProperties
    resultsOrder?: React.CSSProperties
    resultsName?: React.CSSProperties
    resultsSchool?: React.CSSProperties
    resultsScore?: React.CSSProperties
    resultsTotal?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    button1: true
    button2: true
    button3: true
    seminarButton: true
    inlineLink: true
    postTitle: true
    postBody: true
    postDate: true
    resultsOrder: true
    resultsName: true
    resultsSchool: true
    resultsScore: true
    resultsTotal: true
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

// font sa stiahne z google fonts pri builde a servuje sa od nas
export const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  // nemalo by sa stat, ze sa toto pouzije, ale tak aspon bezpatkove pismo nech tam je, keby daco
  fallback: ['sans-serif'],
})

const _theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // default
      sm: 640, // default = 640
      md: 900, // default = 900
      lg: 1366, // changed to HD, default = 1200
      xl: 1921, // changed to fullHD, default = 1536
    },
  },
  palette: {
    primary: {
      main: colors.black,
    },
  },
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
      fontStyle: 'italic',
    },
    body1: {
      ...font.style,
      fontWeight: 400,
      textAlign: 'justify',
    },
    body2: {
      ...font.style,
      fontWeight: 400,
      textAlign: 'justify',
    },
    body3: {
      ...font.style,
      fontWeight: 400,
      textAlign: 'justify',
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
    seminarButton: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    inlineLink: {
      ...font.style,
      fontWeight: 800,
      fontStyle: 'italic',
      textDecoration: 'underline',
      '&:hover': {
        textDecoration: 'none',
      },
      color: colors.black,
    },
    postTitle: {
      ...font.style,
      fontWeight: 800,
    },
    postBody: {
      ...font.style,
      fontWeight: 400,
      textAlign: 'justify',
      overflowWrap: 'break-word',
    },
    postDate: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 300,
    },
    resultsOrder: {
      ...font.style,
      fontWeight: 800,
      fontStyle: 'italic',
    },
    resultsName: {
      ...font.style,
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
    },
    resultsSchool: {
      ...font.style,
      fontWeight: 400,
    },
    resultsScore: {
      ...font.style,
      fontWeight: 400,
    },
    resultsTotal: {
      ...font.style,
      fontWeight: 800,
      fontStyle: 'italic',
    },
  },
  components: {
    // default: https://github.com/mui/material-ui/blob/68e3b40bc5d21a446e48a5ab651f713ea6337a52/packages/mui-material/src/CssBaseline/CssBaseline.js#L56
    MuiCssBaseline: {
      styleOverrides: {
        // rewrite default textAlign: justify to left
        body: {
          textAlign: 'left',
        },
        /* stuff from Josh Comeau's global CSS reset: https://www.joshwcomeau.com/css/custom-css-reset/ */
        // 3. Allow percentage-based heights in the application
        'html,body': {
          height: '100%',
        },
        // 6. Improve media defaults
        'img,picture,video,canvas,svg': {
          display: 'block',
          maxWidth: '100%',
        },
        // 7. Remove built-in form typography styles
        'input,button,textarea,select': {
          font: 'inherit',
        },
        // 8. Avoid text overflows
        'p,h1,h2,h3,h4,h5,h6': {
          overflowWrap: 'break-word',
        },
        // 9. Create a root stacking context
        '#root,#__next': {
          isolation: 'isolate',
        },
        /* our stuff */
        a: {
          textDecoration: 'none',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body1: 'span',
          body2: 'span',
          body3: 'span',
          button1: 'span',
          button2: 'span',
          button3: 'span',
          seminarButton: 'span',
          inlineLink: 'span',
          postTitle: 'h1',
          postBody: 'span',
          postDate: 'span',
          resultsOrder: 'span',
          resultsName: 'span',
          resultsSchool: 'span',
          resultsScore: 'span',
          resultsTotal: 'span',
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
          padding: '20px',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          paddingRight: '50px',
          paddingLeft: '50px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
})

const pxToRem = _theme.typography.pxToRem
const sm = _theme.breakpoints.up('sm') // 640px
const md = _theme.breakpoints.up('md') // 900px
const lg = _theme.breakpoints.up('lg') // 1366px
const xl = _theme.breakpoints.up('xl') // 1921px

// manual font sizes
export const theme: Theme = {
  ..._theme,
  typography: {
    ..._theme.typography,
    h1: {
      ..._theme.typography.h1,
      // original Figma fontSize: 40px
      fontSize: pxToRem(26),
      [sm]: {fontSize: pxToRem(26)},
      [md]: {fontSize: pxToRem(26)},
      [lg]: {fontSize: pxToRem(32)},
      [xl]: {fontSize: pxToRem(40)},
      lineHeight: 1.5,
    },
    h2: {
      ..._theme.typography.h2,
      // original Figma fontSize: 30px
      fontSize: pxToRem(20),
      [sm]: {fontSize: pxToRem(20)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(22)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    h3: {
      ..._theme.typography.h3,
      // original Figma fontSize: 24px
      fontSize: pxToRem(14),
      [sm]: {fontSize: pxToRem(14)},
      [md]: {fontSize: pxToRem(14)},
      [lg]: {fontSize: pxToRem(18)},
      [xl]: {fontSize: pxToRem(24)},
      lineHeight: 1.5,
    },
    body1: {
      ..._theme.typography.body1,
      // original Figma fontSize: 20px
      fontSize: pxToRem(13),
      [sm]: {fontSize: pxToRem(13)},
      [md]: {fontSize: pxToRem(13)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    body2: {
      ..._theme.typography.body2,
      // original Figma fontSize: 16px
      fontSize: pxToRem(10),
      [sm]: {fontSize: pxToRem(10)},
      [md]: {fontSize: pxToRem(10)},
      [lg]: {fontSize: pxToRem(13)},
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
      fontSize: pxToRem(20),
      [sm]: {fontSize: pxToRem(20)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(22)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    button2: {
      ..._theme.typography.button2,
      // original Figma fontSize: 20px
      fontSize: pxToRem(12),
      [sm]: {fontSize: pxToRem(12)},
      [md]: {fontSize: pxToRem(13)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    button3: {
      ..._theme.typography.button3,
      // original Figma fontSize: 14px
      fontSize: pxToRem(11),
      [sm]: {fontSize: pxToRem(11)},
      [md]: {fontSize: pxToRem(9)},
      [lg]: {fontSize: pxToRem(11)},
      [xl]: {fontSize: pxToRem(14)},
      lineHeight: 1.5,
    },
    seminarButton: {
      ..._theme.typography.seminarButton,
      // original Figma fontSize: 30px, mobile non-existent
      fontSize: pxToRem(14),
      [sm]: {fontSize: pxToRem(16)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(22)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    inlineLink: {
      ..._theme.typography.inlineLink,
      // original Figma fontSize: 20px (matching body1)
      fontSize: pxToRem(13),
      [sm]: {fontSize: pxToRem(13)},
      [md]: {fontSize: pxToRem(13)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    postTitle: {
      ..._theme.typography.postTitle,
      // original Figma fontSize: 36px
      fontSize: pxToRem(22),
      [sm]: {fontSize: pxToRem(22)},
      [md]: {fontSize: pxToRem(22)},
      [lg]: {fontSize: pxToRem(28)},
      [xl]: {fontSize: pxToRem(36)},
      lineHeight: 1.5,
    },
    postBody: {
      ..._theme.typography.postBody,
      // original Figma fontSize: 30px
      fontSize: pxToRem(18),
      [sm]: {fontSize: pxToRem(18)},
      [md]: {fontSize: pxToRem(18)},
      [lg]: {fontSize: pxToRem(22)},
      [xl]: {fontSize: pxToRem(30)},
      lineHeight: 1.5,
    },
    postDate: {
      ..._theme.typography.postDate,
      // original Figma fontSize: 20px
      fontSize: pxToRem(13),
      [sm]: {fontSize: pxToRem(13)},
      [md]: {fontSize: pxToRem(13)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(20)},
      lineHeight: 1.5,
    },
    resultsOrder: {
      ..._theme.typography.resultsOrder,
      fontSize: pxToRem(20), // design
      [sm]: {fontSize: pxToRem(26)},
      [md]: {fontSize: pxToRem(26)},
      [lg]: {fontSize: pxToRem(32)},
      [xl]: {fontSize: pxToRem(48)}, // design
      lineHeight: 1.5,
    },
    resultsName: {
      ..._theme.typography.resultsName,
      fontSize: pxToRem(11), // design
      [sm]: {fontSize: pxToRem(16)},
      [md]: {fontSize: pxToRem(20)},
      [lg]: {fontSize: pxToRem(24)},
      [xl]: {fontSize: pxToRem(30)}, // design
      lineHeight: 1.5,
    },
    resultsSchool: {
      ..._theme.typography.resultsSchool,
      fontSize: pxToRem(10), // design
      [sm]: {fontSize: pxToRem(11)},
      [md]: {fontSize: pxToRem(12)},
      [lg]: {fontSize: pxToRem(13)},
      [xl]: {fontSize: pxToRem(14)}, // design
      lineHeight: 1.5,
    },
    resultsScore: {
      ..._theme.typography.resultsScore,
      fontSize: pxToRem(10), // design
      [sm]: {fontSize: pxToRem(12)},
      [md]: {fontSize: pxToRem(14)},
      [lg]: {fontSize: pxToRem(16)},
      [xl]: {fontSize: pxToRem(18)}, // design
      lineHeight: 1.5,
    },
    resultsTotal: {
      ..._theme.typography.resultsTotal,
      fontSize: pxToRem(20), // design
      [sm]: {fontSize: pxToRem(22)},
      [md]: {fontSize: pxToRem(24)},
      [lg]: {fontSize: pxToRem(26)},
      [xl]: {fontSize: pxToRem(30)}, // design
      lineHeight: 1.5,
    },
  },
}
