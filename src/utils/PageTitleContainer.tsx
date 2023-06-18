import {useState} from 'react'
import {createContainer} from 'unstated-next'

const usePageTitle = () => {
  const [pageTitle, setPageTitle] = useState('')
  return {pageTitle, setPageTitle}
}

export const PageTitleContainer = createContainer(usePageTitle)
