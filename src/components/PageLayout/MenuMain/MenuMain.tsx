import axios from 'axios'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'
import * as FaIcons from 'react-icons/fa'

import {Authentication} from '../Authentication/Authentication'
import styles from './MenuMain.module.scss'

export const getSeminarName = (seminarId: number) => {
  switch (seminarId) {
    case 0:
      return 'strom'
    case 1:
      return 'matik'
    case 2:
      return 'malynar'
    default:
      return 'strom'
  }
}
interface MenuItemInterface {
  id: number
  caption: string
  url: string
}

export const MenuMain: FC<{seminarId: number}> = ({seminarId}) => {
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
            return (
              <MenuMainItem
                key={menuItem.id}
                caption={menuItem.caption}
                url={`/${getSeminarName(seminarId)}${menuItem.url}`}
              />
            )
          })}
      </div>
      <Authentication />
    </div>
  )
}

const MenuMainItem: FC<{caption: string; url: string}> = ({caption, url}) => {
  const router = useRouter()
  return (
    <div className={router.pathname === url ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
      <Link href={url}>
        <a>{caption}</a>
      </Link>
    </div>
  )
}
