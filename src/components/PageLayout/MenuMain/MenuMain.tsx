import {Box, Stack, Theme, Typography, useMediaQuery} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {CloseButton} from '@/components/CloseButton/CloseButton'
import {Loading} from '@/components/Loading/Loading'
import Menu from '@/svg/menu.svg'
import {MenuItemShort} from '@/types/api/cms'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Authentication} from '../Authentication/Authentication'
import styles from './MenuMain.module.scss'

export const MenuMain: FC = () => {
  const {seminar, seminarId} = useSeminarInfo()
  const {id} = useDataFromURL()

  const {hasPermissions} = useHasPermissions()

  const [isVisible, setIsVisible] = useState(true)
  const toggleMenu = () => setIsVisible((currentIsVisible) => !currentIsVisible)

  const {data: menuItemsData, isLoading: menuItemsIsLoading} = useQuery({
    queryKey: ['cms', 'menu-item', 'on-site', seminarId, '?menu'],
    queryFn: () => axios.get<MenuItemShort[]>(`/api/cms/menu-item/on-site/${seminarId}?type=menu`),
  })
  const menuItems = menuItemsData?.data ?? []

  const lg = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  const iconSize = lg ? 40 : 30

  return (
    <>
      {!isVisible && (
        <div className={clsx(styles.menuButton, styles.menuOpenButton)} onClick={toggleMenu}>
          <Menu width={iconSize} height={iconSize} />
        </div>
      )}
      <Stack
        sx={{
          position: 'fixed',
          width: '25%',
          height: '100%',
          left: 0,
          top: isVisible ? 0 : '-100%',
          overflow: 'auto',
          backgroundColor: 'black',
          transition: '750ms',
          zIndex: 100,
        }}
      >
        <Box flexGrow={1}>
          <CloseButton
            size={iconSize}
            onClick={toggleMenu}
            className={clsx(styles.menuButton, styles.menuCloseButton)}
          />
          {menuItemsIsLoading && (
            <div className={styles.loading}>
              <Loading />
            </div>
          )}
          <Stack mt="176px">
            {menuItems.map(({id, caption, url}) => (
              // `url` je vo formate `/vysledky/` alebo `/akcie/matboj/`
              <MenuMainItem key={id} caption={caption} url={`/${seminar}${url}`} />
            ))}
          </Stack>
          {hasPermissions && (
            <Stack sx={{mt: 4, mx: 2, borderTop: '8px dashed white', pt: 4}}>
              <MenuMainItem caption="Opravovanie" url={`/${seminar}/admin/opravovanie/`} />
              <MenuMainItem caption="Admin" url="/admin" />
            </Stack>
          )}
        </Box>
        <Authentication />
      </Stack>
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
    <div className={clsx(styles.menuItem, active && styles.active)}>
      <Typography variant="button1" fontStyle="normal">
        <Link href={url}>{caption}</Link>
      </Typography>
    </div>
  )
}
