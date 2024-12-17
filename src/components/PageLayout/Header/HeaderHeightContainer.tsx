import {useState} from 'react'
import {createContainer} from 'unstated-next'

const useHeaderHeight = () => {
  const [height, setHeight] = useState(0)

  return {height, setHeight}
}

export const HeaderHeightContainer = createContainer(useHeaderHeight)
