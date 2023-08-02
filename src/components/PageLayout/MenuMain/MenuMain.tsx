import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'
import * as FaIcons from 'react-icons/fa'

import {CloseButton} from '@/components/CloseButton/CloseButton'
import {Loading} from '@/components/Loading/Loading'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Authentication} from '../Authentication/Authentication'
import styles from './MenuMain.module.scss'

interface MenuItemInterface {
  id: number
  caption: string
  url: string
}

export const MenuMain: FC = () => {
  const {seminar, seminarId} = useSeminarInfo()

  const [isVisible, setIsVisible] = useState(true)
  const toggleMenu = () => setIsVisible((currentIsVisible) => !currentIsVisible)

  const {data: menuItemsData, isLoading: menuItemsIsLoading} = useQuery({
    queryKey: ['cms', 'menu-item', 'on-site', seminarId],
    queryFn: () => axios.get<MenuItemInterface[]>(`/api/cms/menu-item/on-site/${seminarId}`),
  })
  const menuItems = menuItemsData?.data ?? []

  return (
    <div className={clsx(styles.menu, isVisible && styles.visible)}>
      {!isVisible && (
        <div className={styles.menuOpenButton}>
          <FaIcons.FaBars onClick={toggleMenu} />
        </div>
      )}
      <CloseButton onClick={toggleMenu} size={50} />
      {menuItemsIsLoading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      <div className={styles.menuItems}>
        {menuItems.map((menuItem: MenuItemInterface) => {
          // `menuItem.url` je vo formate `/vysledky/` alebo `/akcie/matboj/`
          return <MenuMainItem key={menuItem.id} caption={menuItem.caption} url={`/${seminar}${menuItem.url}`} />
        })}
      </div>
      <Authentication />
    </div>
  )
}

const MenuMainItem: FC<{caption: string; url: string}> = ({caption, url}) => {
  const router = useRouter()
  // pre routy, kde by `pathname` vratilo napr. `/matik/vysledky/[[...params]]`,
  // `asPath` vrati URL ako v browseri, teda `/matik/vysledky` alebo `/matik/vysledky/44/leto/2`
  // potrebne koncove lomitko pre porovnanie s URLkami z BE
  const pathWithSlash = `${router.asPath}/`

  // ak sme na `/matik/vysledky/44/leto/2`, orezme to na dlzku `url`, v zavere porovnajme
  // (teda v podstate zistime, ci `pathWithSlash` zacina znakmi `url`)
  const active = pathWithSlash.slice(0, url.length) === url

  return (
    <div className={clsx(styles.menuItem, active && styles.active)}>
      <Link href={url}>{caption}</Link>
    </div>
  )
}
