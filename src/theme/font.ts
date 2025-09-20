import {Poppins} from 'next/font/google'

// font sa stiahne z google fonts pri builde a servuje sa od nas
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  // nemalo by sa stat, ze sa toto pouzije, ale tak aspon bezpatkove pismo nech tam je, keby daco
  fallback: ['sans-serif'],
})
