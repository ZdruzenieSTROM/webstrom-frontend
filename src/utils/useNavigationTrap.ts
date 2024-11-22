import {useRouter} from 'next/router'
import {useCallback, useEffect, useRef} from 'react'

interface NavigationTrapProps {
  shouldBlockNavigation: boolean
  onNavigate: () => void
}

export const useNavigationTrap = ({shouldBlockNavigation, onNavigate}: NavigationTrapProps) => {
  const router = useRouter()

  const currentPath = router.asPath
  const nextPath = useRef('')
  const navConfirmend = useRef(false)

  const killNavigation = useCallback(() => {
    router.events.emit('routeChangeError', '', '', {shallow: false})

    // eslint-disable-next-line no-throw-literal
    throw 'Canceling navigation due to unsaved changes in the page'
  }, [router])

  useEffect(() => {
    const pageNavigate = (path: string) => {
      if (navConfirmend.current) return
      if (shouldBlockNavigation && path !== currentPath) {
        nextPath.current = path
        onNavigate()
        killNavigation()
      }
    }

    router.events.on('routeChangeStart', pageNavigate)

    return () => {
      router.events.off('routeChangeStart', pageNavigate)
    }
  }, [shouldBlockNavigation, currentPath, killNavigation, onNavigate, router.events])

  const continueNavigation = () => {
    navConfirmend.current = true
    router.push(nextPath.current)
  }

  return {nextPath, continueNavigation}
}
