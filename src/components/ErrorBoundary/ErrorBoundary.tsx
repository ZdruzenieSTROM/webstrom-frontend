import {Box, Button, Typography} from '@mui/material'
import * as Sentry from '@sentry/nextjs'
import type {FC, PropsWithChildren} from 'react'

import {colors} from '@/theme/colors'

const fallback = (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 2,
      p: 2,
      textAlign: 'center',
      backgroundColor: colors.white,
    }}
  >
    <Typography variant="h2">Niečo sa pokazilo.</Typography>
    <Typography variant="body1">Skús obnoviť stránku.</Typography>
    <Button variant="contained" onClick={() => window.location.reload()}>
      Obnoviť
    </Button>
  </Box>
)

// Sentry.ErrorBoundary reports caught errors via Sentry.captureException automatically.
export const ErrorBoundary: FC<PropsWithChildren> = ({children}) => (
  <Sentry.ErrorBoundary fallback={fallback}>{children}</Sentry.ErrorBoundary>
)
