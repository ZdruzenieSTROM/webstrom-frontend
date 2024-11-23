import {useEffect, useRef, useState} from 'react'
import {createContainer} from 'unstated-next'

const usePageTitle = (initial = '') => {
  const [pageTitle, setPageTitle] = useState(initial)

  const firstRender = useRef(true)

  // ked navigujeme napr. z Kos na Matboj, ostavame na /akcie/[[]..params]], preto treba tento effect
  useEffect(() => {
    // na konci prveho renderu ale zbytocne budeme nastavovat title na `initial` znovu,
    // a tym dovolime inym komponentom (napr. SemesterPicker-u) nastavit title zdola
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setPageTitle(initial)
  }, [initial])

  return {pageTitle, setPageTitle}
}

export const PageTitleContainer = createContainer(usePageTitle)
