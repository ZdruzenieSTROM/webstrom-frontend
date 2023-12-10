import HomeIcon from '@mui/icons-material/Home'
import {Box, IconButton, Tooltip} from '@mui/material'
import {useRouter} from 'next/router'
import {AppBar, Layout, LayoutProps} from 'react-admin'

const AppMenuBar = () => {
  const router = useRouter()

  return (
    <>
      <AppBar position="relative">
        <Box flex={1} />
        <Tooltip title="Back to main page">
          <IconButton color="inherit" onClick={() => router.push('/')}>
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </AppBar>
    </>
  )
}

export const AdminLayout = (props: LayoutProps) => {
  return <Layout {...props} appBar={AppMenuBar} />
}
