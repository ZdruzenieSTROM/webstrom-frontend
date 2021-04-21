import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {useLocation} from 'react-router-dom'

import {Router} from './pages/Router/Router'

export const Webstrom: React.FC = () => {
  const location = useLocation()
  const [seminarId, setSeminarId] = useState(getSeminarId(location.pathname))
  const [, , removeCookie] = useCookies(['webstrom-token', 'webstrom-name'])

  useEffect(() => {
    setSeminarId(getSeminarId(location.pathname))
  }, [location])

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const status = error.response ? error.response.status : null

        if (status === 401) {
          // Nesprávny webstrom-token vráti 401. V tomto prápade sa zrušia cookies ktoré
          // ukladajú informácie o userovi, zruší sa autorizačný header a prepošle sa request.

          removeCookie('webstrom-token', {path: '/'})
          removeCookie('webstrom-name', {path: '/'})

          const originalRequestConfig = error.config
          delete originalRequestConfig.headers['Authorization']

          return await axios.request(originalRequestConfig)
        }

        return Promise.reject(error)
      },
    )
    // removeCookie funkcia je definovaná pomocou useCookies hooku a preto sa nedá
    // presunúť do useEffect. Preto skutočne nemá byť v dependency liste.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Router seminarId={seminarId} />
}

const getSeminarId = (path: string) => {
  // Táto funkcia vráti id seminára podľa aktuálnej cesty

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
