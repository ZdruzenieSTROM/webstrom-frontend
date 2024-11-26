import {Home, Logout} from '@mui/icons-material/'
import {Button, Stack, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, PropsWithChildren} from 'react'
import {AppBar, Layout, useLogout} from 'react-admin'

const AppMenuBar = () => {
  const router = useRouter()
  const logout = useLogout()

  return (
    <AppBar
      userMenu={false}
      position="relative"
      toolbar={
        <Stack gap={2} direction="row">
          <Button color="inherit" onClick={() => router.push('/strom')}>
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

export const AdminLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <>
      <Layout appBar={AppMenuBar}>{children}</Layout>
      <Stack
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          padding: 6,
          textAlign: 'center',
          backgroundColor: '#efefef',
        }}
      >
        <Typography color={'#000000'} fontSize={'0.8em'}>
          Všetky časy sú uvedené v časovom pásme Europe/Bratislava
        </Typography>
      </Stack>
    </>
  )
}
