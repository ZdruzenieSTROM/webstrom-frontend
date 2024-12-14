import {useState} from 'react'
import {createContainer} from 'unstated-next'

const useBannerAnimation = () => {
  const [play, setPlay] = useState(true)
  const togglePlay = () => setPlay((prev) => !prev)

  return {play, setPlay, togglePlay}
}

export const BannerAnimationContainer = createContainer(useBannerAnimation)
