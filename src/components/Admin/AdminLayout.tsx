import {Home, Logout} from '@mui/icons-material/'
import {Button, Stack, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {AppBar, Layout, LayoutProps, useLogout} from 'react-admin'

const AppMenuBar = () => {
  const router = useRouter()
  const logout = useLogout()

  return (
    <AppBar
      userMenu={false}
      position="relative"
      toolbar={
        <Stack gap={2} direction="row">
          <Button color="inherit" onClick={() => router.push('/')}>
            <Stack gap={1} direction="row">
              <Home />
              <Typography variant="body1">Späť na hlavnú stránku</Typography>
            </Stack>
          </Button>

          <Button color="inherit" onClick={() => logout()}>
            <Stack gap={1} direction="row">
              <Logout />
              <Typography variant="body1">Odhlásiť</Typography>
            </Stack>
          </Button>
        </Stack>
      }
    />
  )
}

export const AdminLayout = (props: LayoutProps) => {
  return <Layout {...props} appBar={AppMenuBar} />
}
