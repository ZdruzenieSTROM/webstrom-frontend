// import './MenuMain.css'
import axios from 'axios'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'
import * as FaIcons from 'react-icons/fa'

import {Authentication} from './Authentication'

interface MenuItemInterface {
  id: number
  caption: string
  url: string
}

export const MenuMain: FC<{seminarId: number}> = ({seminarId}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [menuItems, setMenuItems] = useState<MenuItemInterface[]>([])

  const getPrefix = () => {
    switch (seminarId) {
      case 1:
        return '/strom'
      case 2:
        return '/matik'
      case 3:
        return '/malynar'
      case 4:
        return '/zdruzenie'
      default:
        return '/strom'
    }
  }

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
    <div id="menu-main" className={isVisible ? 'visible' : ''}>
      {!isVisible && (
        <div id="menu-main-open-button">
          <FaIcons.FaBars className="icon-bars" onClick={toggleMenu} />
        </div>
      )}
      <div id="menu-main-close-button">
        <CgIcons.CgClose className="icon-close-menu" onClick={toggleMenu} />
      </div>
      <div id="menu-main-items">
        {menuItems &&
          menuItems.map((menuItem: MenuItemInterface) => {
            return <MenuMainItem key={menuItem.id} caption={menuItem.caption} url={getPrefix() + menuItem.url} />
          })}
      </div>
      <Authentication />
    </div>
  )
}

const MenuMainItem: FC<{caption: string; url: string}> = ({caption, url}) => {
  const router = useRouter()
  return (
    <div className={router.pathname === url ? 'menu-main-item active' : 'menu-main-item'}>
      <Link href={url}>
        <a>{caption}</a>
      </Link>
    </div>
  )
}
