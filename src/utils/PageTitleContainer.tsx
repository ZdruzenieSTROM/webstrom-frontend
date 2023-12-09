import {useState} from 'react'
import {createContainer} from 'unstated-next'
import {useUpdateEffect} from 'usehooks-ts'

const usePageTitle = (initial = '') => {
  const [pageTitle, setPageTitle] = useState(initial)

  useUpdateEffect(() => {
    setPageTitle(initial)
  }, [initial])

  return {pageTitle, setPageTitle}
}

export const PageTitleContainer = createContainer(usePageTitle)
