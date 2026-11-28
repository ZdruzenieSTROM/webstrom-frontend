import {useRouter} from 'next/router'
import {useCallback, useEffect, useRef, useState} from 'react'

export const NAVIGATION_TRAP_ERROR_MESSAGE = 'Canceling navigation due to unsaved changes in the page'

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

    // Next's pages router has no API to cancel a route change; throwing from a routeChangeStart handler is the only
    // way to abort it. The error surfaces as an unhandled rejection, which sentryBeforeSend drops.
    throw new Error(NAVIGATION_TRAP_ERROR_MESSAGE)
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
