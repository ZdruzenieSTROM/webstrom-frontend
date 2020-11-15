import './MenuMain.css'

import axios from 'axios'
import React, {useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'
import * as FaIcons from 'react-icons/fa'
import {Link, useLocation} from 'react-router-dom'

interface MenuItemInterface {
  id: number
  caption: string
  url: string
}

export const MenuMain: React.FC<{seminarId: number}> = ({seminarId}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [menuItems, setMenuItems] = useState<MenuItemInterface[]>([])

  const toggleMenu = () => {
    setIsVisible((currentIsVisible) => !currentIsVisible)
  }

  useEffect(() => {
    axios.get(`/api/cms/menu-item/on-site/${seminarId}/`).then((res) => {
      setMenuItems(res.data)
    })
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
            return <MenuMainItem key={menuItem.id} caption={menuItem.caption} url={menuItem.url} />
          })}
      </div>
    </div>
  )
}

const MenuMainItem: React.FC<{caption: string; url: string}> = ({caption, url}) => {
  const location = useLocation()

  return (
    <div className={location.pathname === url ? 'menu-main-item active' : 'menu-main-item'}>
      <Link to={url}>{caption}</Link>
    </div>
  )
}
