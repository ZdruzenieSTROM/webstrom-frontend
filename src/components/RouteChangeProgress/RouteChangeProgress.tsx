import {LinearProgress} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

// Most navigations finish within a few hundred ms (shallow ones instantly), so the bar appears only
// after this delay - otherwise it would blink on every click.
const SHOW_DELAY_MS = 150

// Client-side navigation waits for the target page's `getServerSideProps` before anything changes,
// which takes seconds on pages like Poradie. Without this bar the clicked link looks dead.
export const RouteChangeProgress: FC = () => {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    const start = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    }
    const done = () => {
      clearTimeout(timeout)
      setVisible(false)
    }
    // A click during an in-flight navigation cancels it, and the new navigation's
    // `routeChangeStart` follows within microtasks. Hiding at once would blink the bar off for
    // SHOW_DELAY_MS on every repeated click, so the hide waits a macrotask and `start` clears it.
    const fail = (err: {cancelled?: boolean} | string) => {
      if (typeof err === 'object' && err?.cancelled) {
        clearTimeout(timeout)
        timeout = setTimeout(() => setVisible(false))
      } else {
        done()
      }
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', fail)

    return () => {
      clearTimeout(timeout)
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', fail)
    }
  }, [router.events])

  if (!visible) return null

  return (
    <LinearProgress
      aria-label="Načítava sa stránka"
      sx={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.tooltip}}
    />
  )
}
