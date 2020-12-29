import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import {Footer} from './components/Footer'
import {MenuMain} from './components/MenuMain/'
import {MenuSeminars} from './components/MenuSeminars'
import {MainContentRouter} from './pages/MainContentRouter'

export const Webstrom: React.FC = () => {
  const location = useLocation()
  const [seminarId, setSeminarId] = useState(getSeminarId(location.pathname))

  useEffect(() => {
    setSeminarId(getSeminarId(location.pathname))
  }, [location])

  return (
    <>
      <div id="page-container">
        <MenuSeminars seminarId={seminarId} />
        <MenuMain seminarId={seminarId} />
        <MainContentRouter seminarId={seminarId} />
        <Footer />
      </div>
    </>
  )
}

const getSeminarId = (path: string) => {
  /**
   * Táto funkcia vráti id seminára podľa aktuálnej cesty
   */
  let seminarId = 0

  switch (path.split('/')[1]) {
    case 'strom':
      seminarId = 1
      break
    case 'matik':
      seminarId = 2
      break
    case 'malynar':
      seminarId = 3
      break
    case 'zdruzenie':
      seminarId = 4 // zatiaľ neexistujú žiadne menu itemy v api
      break
    case 'admin':
      seminarId = 5 // zatiaľ neexistujú žiadne menu itemy v api
      break
    default:
      seminarId = 0
      break
  }
  return seminarId
}
