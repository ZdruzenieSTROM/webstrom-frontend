import {useState} from 'react'
import {createContainer} from 'unstated-next'

const usePageTitle = (initial = '') => {
  const [pageTitle, setPageTitle] = useState(initial)
  return {pageTitle, setPageTitle}
}

export const PageTitleContainer = createContainer(usePageTitle)
