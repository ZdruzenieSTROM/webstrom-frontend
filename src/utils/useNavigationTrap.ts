import {useRouter} from 'next/router'
import {useCallback, useEffect, useRef, useState} from 'react'

interface NavigationTrapProps {
  shouldBlockNavigation: boolean
  onNavigate: () => void
}

export const useNavigationTrap = ({shouldBlockNavigation, onNavigate}: NavigationTrapProps) => {
  const router = useRouter()

  const currentPath = router.asPath
  const nextPath = useRef('')
  const navConfirmed = useRef(false)
  const [override, setOverride] = useState(false)

  const killNavigation = useCallback(() => {
    router.events.emit('routeChangeError', '', '', {shallow: false})

    // eslint-disable-next-line no-throw-literal
    throw 'Canceling navigation due to unsaved changes in the page'
  }, [router])

  useEffect(() => {
    const pageNavigate = (path: string) => {
      if (override || navConfirmed.current) return
      if (shouldBlockNavigation && path !== currentPath) {
        nextPath.current = path
        onNavigate()
        killNavigation()
      }
    }

    const pageExit = (e: BeforeUnloadEvent) => {
      if (shouldBlockNavigation) e.preventDefault()
    }

    router.events.on('routeChangeStart', pageNavigate)
    window.addEventListener('beforeunload', pageExit)

    return () => {
      router.events.off('routeChangeStart', pageNavigate)
      window.removeEventListener('beforeunload', pageExit)
    }
  }, [shouldBlockNavigation, currentPath, killNavigation, onNavigate, override, router.events])

  const continueNavigation = () => {
    navConfirmed.current = true
    router.push(nextPath.current)
  }

  return {nextPath, continueNavigation, setOverride}
}
