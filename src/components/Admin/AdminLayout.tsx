import {Home, Logout} from '@mui/icons-material/'
import {Button, Stack, Typography} from '@mui/material'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import Link from 'next/link'
import {FC, PropsWithChildren} from 'react'
import {AppBar, Layout, ToggleThemeButton, useLogout, useTranslate} from 'react-admin'

const AppMenuBar = () => {
  const logout = useLogout()
  const translate = useTranslate()
  return (
    <AppBar
      userMenu={false}
      position="fixed"
      toolbar={
        <Stack gap={2} direction="row">
          <Button component={Link} color="inherit" href="/strom">
            <Stack gap={1} direction="row">
              <Home />
              <Typography variant="body1">{translate('controls.back_home')}</Typography>
            </Stack>
          </Button>

          <ToggleThemeButton />

          <Button color="inherit" onClick={() => logout()}>
            <Stack gap={1} direction="row">
              <Logout />
              <Typography variant="body1">{translate('controls.logout')}</Typography>
            </Stack>
          </Button>
        </Stack>
      }
    />
  )
}

const footerHeight = '32px'

export const AdminLayout: FC<PropsWithChildren> = ({children}) => {
  const translate = useTranslate()
  return (
    <>
      <Layout
        appBar={AppMenuBar}
        sx={{
          pb: footerHeight,
          // there's no way to style the DevTools directly, we move them up above the footer as well.
          // another approach would be just changing z-index.
          // 12px is the hardcoded bottom offset for the DevTools button
          '.tsqd-open-btn-container': {bottom: `calc(12px + ${footerHeight})`},
          '.tsqd-main-panel': {bottom: footerHeight},
        }}
      >
        {children}
        <ReactQueryDevtools />
      </Layout>
      <Stack
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          height: footerHeight,
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: '#efefef',
        }}
      >
        <Typography color={'#000000'} fontSize={'0.8em'}>
          {translate('content.footer.timezone_message')}
        </Typography>
      </Stack>
    </>
  )
}
