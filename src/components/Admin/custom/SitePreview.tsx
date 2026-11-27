import {Box} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {FC, ReactNode} from 'react'

import {colors} from '@/theme/colors'
import {theme} from '@/theme/theme'

// Approximates the site's content column (contentWidth={2} in PageLayout) inside the dark admin,
// so a preview renders with the site's theme, colors and line width rather than the admin's.
export const SitePreview: FC<{children: ReactNode}> = ({children}) => (
  <ThemeProvider theme={theme}>
    <Box sx={{color: colors.black, background: colors.white, p: '10px', width: {xs: '100%', md: '50vw'}}}>
      {children}
    </Box>
  </ThemeProvider>
)
