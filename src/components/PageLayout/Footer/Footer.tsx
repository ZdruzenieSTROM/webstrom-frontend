import {Facebook, Instagram} from '@mui/icons-material'
import {Grid, Stack} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiOptions} from '@/api/api'
import {IconButton} from '@/components/Clickable/IconButton'
import {Link} from '@/components/Clickable/Link'
import {Loading} from '@/components/Loading/Loading'
import {Logo} from '@/components/PageLayout/Footer/Logo'
import {colors} from '@/theme/colors'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

const isRelativeLink = (href: string) => href.startsWith('/')

export const Footer: FC = () => {
  const {seminar, seminarId} = useSeminarInfo()

  const {
    data: menuItemsData,
    isLoading: menuItemsIsLoading,
    error: menuItemsError,
  } = useQuery(apiOptions.cms.menuItem.onSite(seminarId, 'footer'))
  const menuItems = menuItemsData ?? []

  const {data: logosData, isLoading: logosIsLoading, error: logosError} = useQuery(apiOptions.cms.logo())
  const logos = logosData?.filter((logo) => !logo.disabled) ?? []

  return (
    <Grid
      container
      sx={{
        width: '100%',
        bgcolor: colors.black,
        color: colors.white,
      }}
    >
      <Grid size={{xs: 0, md: 3}} sx={{display: {xs: 'none', md: 'block'}}} />
      <Grid size={{xs: 12, md: 6}} display="flex" flexDirection="column" gap={2} py={2}>
        <Stack direction="row" gap={1} justifyContent="center" sx={{flexWrap: 'wrap'}}>
          {menuItemsIsLoading && <Loading />}
          {menuItems.map((item) => (
            <Link
              key={item.id}
              variant="button2"
              // itemy z BE su bud relativne k seminar URL alebo absolutne
              href={isRelativeLink(item.url) ? `/${seminar}${item.url}` : item.url}
              invertColors
            >
              {item.caption}
            </Link>
          ))}
          {menuItemsError && <p>{menuItemsError.message}</p>}
        </Stack>
        <Stack direction="row" justifyContent="center" gap={2}>
          <IconButton href="https://www.facebook.com/zdruzeniestrom" aria-label="Facebook" invertColors>
            <Facebook sx={{fontSize: 32}} />
          </IconButton>
          <IconButton href="https://www.instagram.com/zdruzeniestrom" aria-label="Instagram" invertColors>
            <Instagram sx={{fontSize: 32}} />
          </IconButton>
        </Stack>
        <Stack direction="row" gap={2} justifyContent="center" sx={{flexWrap: 'wrap'}}>
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
