import {useState} from 'react'
import {createContainer} from 'unstated-next'

const useBannerText = () => {
  const [bannerText, setBannerText] = useState('')
  return {bannerText, setBannerText}
}

export const BannerContainer = createContainer(useBannerText)
