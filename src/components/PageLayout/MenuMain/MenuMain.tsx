import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'
import * as FaIcons from 'react-icons/fa'

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
  const [menuItems, setMenuItems] = useState<MenuItemInterface[]>([])

  const toggleMenu = () => {
    setIsVisible((currentIsVisible) => !currentIsVisible)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<MenuItemInterface[]>(`/api/cms/menu-item/on-site/${seminarId}/`)
        setMenuItems(data)
      } catch {
        return
      }
    }
    fetchData()
  }, [seminarId])

  return (
    <div className={isVisible ? `${styles.menu} ${styles.visible}` : styles.menu}>
      {!isVisible && (
        <div className={styles.menuOpenButton}>
          <FaIcons.FaBars className="icon-bars" onClick={toggleMenu} />
        </div>
      )}
      <div className={styles.menuCloseButton}>
        <CgIcons.CgClose className={styles.iconCloseMenu} onClick={toggleMenu} />
      </div>
      <div className={styles.menuItems}>
        {menuItems &&
          menuItems.map((menuItem: MenuItemInterface) => {
            // url je vo formate `/matik/vysledky/`
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
      <Link href={url}>
        <a>{caption}</a>
      </Link>
    </div>
  )
}
