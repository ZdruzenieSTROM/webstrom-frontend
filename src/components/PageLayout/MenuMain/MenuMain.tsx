import {Box, Drawer, Stack, Theme, useMediaQuery} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

import {Link} from '@/components/Clickable/Link'
import {CloseButton} from '@/components/CloseButton/CloseButton'
import {Loading} from '@/components/Loading/Loading'
import Menu from '@/svg/menu.svg'
import {MenuItemShort} from '@/types/api/cms'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {BottomButtons} from './BottomButtons'

export const MenuMain: FC = () => {
  const {seminar, seminarId} = useSeminarInfo()

  const {hasPermissions} = useHasPermissions()

  const [isVisible, setIsVisible] = useState(true)
  const toggleMenu = () => setIsVisible((currentIsVisible) => !currentIsVisible)

  const fullWidthMenu = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  useEffect(() => {
    fullWidthMenu && setIsVisible(false)
  }, [fullWidthMenu])

  // Inspired by https://nextjs.org/docs/pages/api-reference/functions/use-router#routerevents
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      fullWidthMenu && setIsVisible(false)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, fullWidthMenu])

  const {data: menuItemsData, isLoading: menuItemsIsLoading} = useQuery({
    queryKey: ['cms', 'menu-item', 'on-site', seminarId, '?menu'],
    queryFn: () => axios.get<MenuItemShort[]>(`/api/cms/menu-item/on-site/${seminarId}?type=menu`),
  })
  const menuItems = menuItemsData?.data ?? []

  const lg = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  const iconSize = lg ? 34 : 24

  const constructUrl = (url: string) => {
    // `url` z databazy z menu item
    // je vo formate `/vysledky/` alebo `/akcie/matboj/`
    // kedy sa odkazuje na podstranku v ramci daneho seminara
    // alebo https://domain.com alebo www.domain.com
    // v pripade externeho linku kedy presmerujeme priamo na dany link.
    if (url.startsWith('http') || url.startsWith('www')) {
      return url
    }

    if (!url.startsWith('/')) {
      url = `/${url}`
    }

    return `/${seminar}${url}`
  }

  return (
    <>
      {!isVisible && (
        <Box
          sx={{cursor: 'pointer', padding: 0.5, '&:hover': {color: 'white', background: 'black'}}}
          onClick={toggleMenu}
        >
          <Menu width={iconSize} height={iconSize} />
        </Box>
      )}
      <Drawer
        open={isVisible}
        onClose={toggleMenu}
        // sits on the same layer as other content, allows us to scroll while the drawer is open
        variant="persistent"
        anchor="top"
        hideBackdrop
        sx={{
          // we want a full-height left drawer to appear from the top. MUI Drawer doesn't
          // support this out of the box, so we use a top-anchored drawer with some position
          // args manually unset/zeroed here
          bottom: 'unset',
          right: 'unset',
          '& .MuiDrawer-paper': {
            backgroundColor: 'black',
            right: 'unset',
            bottom: 0,
            width: {xs: '100%', md: '25%'},
          },
        }}
      >
        <Box flexGrow={1}>
          <CloseButton
            size={iconSize}
            onClick={toggleMenu}
            sx={{position: 'absolute', top: 24, left: {xs: 'auto', md: 24}, right: {xs: 24, md: 'auto'}}}
          />
          {menuItemsIsLoading && (
            <Box sx={{position: 'absolute', top: '50%', left: 0, right: 0, color: 'white'}}>
              <Loading />
            </Box>
          )}
          <Stack sx={{mt: {xs: 10, md: '164px', lg: '185px', xl: '221px'}}}>
            {menuItems.map(({id, caption, url}) => (
              <MenuMainItem key={id} caption={caption} url={constructUrl(url)} />
            ))}
          </Stack>
          {hasPermissions && (
            <>
              <Box sx={{my: 4, mx: 2, borderBottom: '6px dashed white'}} />
              <Stack>
                <MenuMainItem caption="Opravovanie" url={`/${seminar}/admin/opravovanie/`} />
                <MenuMainItem caption="Admin" url="/admin" />
              </Stack>
            </>
          )}
        </Box>
        <BottomButtons />
      </Drawer>
    </>
  )
}

const MenuMainItem: FC<{caption: string; url: string}> = ({caption, url}) => {
  const router = useRouter()
  // pre routy, kde by `pathname` vratilo napr. `/matik/vysledky/[[...params]]`,
  // `asPath` vrati URL ako v browseri, teda `/matik/vysledky` alebo `/matik/vysledky/44/leto/2`
  // potrebne koncove lomitko pre porovnanie s URLkami z BE
  const pathWithSlash = `${router.asPath}/`

  let active

  const urlArray = url.split('/')
  if (urlArray.length === 3 && urlArray[0] === '' && urlArray[2] === '') {
    // riesi case ked url je napr. /strom/ a teda nestaci porovnanie so .startsWith
    // urlArray je tak v tvare ['', 'strom', ''] co overuje dlzka 3 a zaciatok/koniec ako ''
    active = pathWithSlash === url
  } else {
    active = pathWithSlash.startsWith(url)
  }

  return (
    <Link
      variant="button1"
      href={url}
      invertColors
      active={active}
      sx={{
        justifyContent: 'center',
        // tazko povedat z dizajnu, cele je to nastavene nejak aby bolo dobre
        py: '4px',
        px: '8px',
      }}
      textSx={{
        fontStyle: 'normal',
        textAlign: 'center',
      }}
    >
      {caption}
    </Link>
  )
}
