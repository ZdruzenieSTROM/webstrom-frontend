import {Poppins} from 'next/font/google'
import localFont from 'next/font/local'

// font sa stiahne z google fonts pri builde a servuje sa od nas
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  // nemalo by sa stat, ze sa toto pouzije, ale tak aspon bezpatkove pismo nech tam je, keby daco
  fallback: ['sans-serif'],
})

// Fira Math font for mathematical expressions
export const firaMath = localFont({
  src: '../../public/fonts/FiraMath-Regular.otf',
  variable: '--font-fira-math',
  display: 'swap',
  fallback: ['KaTeX_Main', 'Times New Roman', 'serif'],
})
