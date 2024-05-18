import {useState} from 'react'
import {createContainer} from 'unstated-next'

const useBannerText = () => {
  const [bannerMessages, setBannerMessages] = useState<string[]>([])
  return {bannerMessages, setBannerMessages}
}

export const BannerContainer = createContainer(useBannerText)
