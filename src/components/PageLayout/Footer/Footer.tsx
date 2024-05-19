import {Stack} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Loading} from '@/components/Loading/Loading'
import {ILogo, Logo} from '@/components/PageLayout/Footer/Logo'
import {MenuItemShort} from '@/types/api/cms'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

export const Footer: FC = () => {
  const {seminar, seminarId} = useSeminarInfo()

  const {
    data: menuItemsData,
    isLoading: menuItemsIsLoading,
    error: menuItemsError,
  } = useQuery({
    queryKey: ['cms', 'menu-item', 'on-site', seminarId, '?footer'],
    queryFn: () => axios.get<MenuItemShort[]>(`/api/cms/menu-item/on-site/${seminarId}?type=footer`),
  })
  const menuItems = menuItemsData?.data ?? []

  const {
    data: logosData,
    isLoading: logosIsLoading,
    error: logosError,
  } = useQuery({
    queryKey: ['cms', 'logo'],
    queryFn: () => axios.get<ILogo[]>('/api/cms/logo'),
  })
  const logos = logosData?.data.filter((logo) => !logo.disabled) ?? []

  return (
    <Grid
      container
      sx={{
        width: '100%',
        bgcolor: 'black',
        color: 'white',
      }}
    >
      <Grid xs={0} md={3} sx={{display: {xs: 'none', md: 'block'}}} />
      <Grid xs={12} md={6}>
        <Stack direction="row" m={2} gap={2} justifyContent="center" sx={{flexWrap: 'wrap'}}>
          {menuItemsIsLoading && <Loading />}
          {menuItems.map((item) => (
            <Link key={item.id} variant="button2" href={`/${seminar}${item.url}`} invertColors>
              {item.caption}
            </Link>
          ))}
          {menuItemsError && <p>{menuItemsError.message}</p>}
        </Stack>
        <Stack direction="row" m={2} mt={5} gap={2} justifyContent="center" sx={{flexWrap: 'wrap'}}>
          {logosIsLoading && <Loading />}
          {logos.map((logo) => (
            <Logo key={logo.id} {...logo} />
          ))}
          {logosError && <p>{logosError.message}</p>}
        </Stack>
      </Grid>
    </Grid>
  )
}
