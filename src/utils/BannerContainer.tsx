import {useEffect, useRef, useState} from 'react'
import {createContainer} from 'unstated-next'

const useBannerText = (initial: string[] = []) => {
  const [bannerMessages, setBannerMessages] = useState<string[]>(initial)

  const firstRender = useRef(true)

  // ked navigujeme napr. zo /strom/poradie na /strom/poradie/49/zima, ostavame na tej istej stranke,
  // ale zmeni sa hodnota `initial`, co prichadza z query
  useEffect(() => {
    // na konci prveho renderu ale zbytocne budeme nastavovat bannerMessages na `initial` znovu,
    // a tym dovolime inym komponentom pripadne nastavit bannerMessages zdola
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setBannerMessages(initial)
  }, [initial])

  return {bannerMessages, setBannerMessages}
}

export const BannerContainer = createContainer(useBannerText)
