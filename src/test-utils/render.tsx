import {ThemeProvider} from '@mui/material/styles'
import {render} from '@testing-library/react'
import mockRouter from 'next-router-mock'
import {ReactElement} from 'react'

import {AlertBox} from '@/components/Alert/AlertBox'
import {theme} from '@/theme/theme'
import {AlertContainer} from '@/utils/AlertContainer'
import {AuthContainer} from '@/utils/AuthContainer'
import {ReactQueryProvider} from '@/utils/ReactQueryProvider'

type Route = Parameters<typeof mockRouter.setCurrentUrl>[0]

/**
 * Renders `ui` on `route` inside the same providers `_app.tsx` mounts, so auth state, query defaults
 * and the global alert dialog behave as in the running app. The network is the only thing replaced -
 * register the backend's answers with `server.use(...)` before rendering.
 */
export const renderApp = (ui: ReactElement, {route}: {route: Route}) => {
  mockRouter.setCurrentUrl(route)

  return render(
    <AlertContainer.Provider>
      <ReactQueryProvider>
        <AuthContainer.Provider>
          <ThemeProvider theme={theme}>
            <AlertBox />
            {ui}
          </ThemeProvider>
        </AuthContainer.Provider>
      </ReactQueryProvider>
    </AlertContainer.Provider>,
  )
}
