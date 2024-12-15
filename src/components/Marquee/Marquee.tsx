import {Box, Stack, SxProps, Theme} from '@mui/material'
import {FC, useEffect, useRef, useState} from 'react'

interface MarqueeProps {
  /**
   * Inline style for the container div
   * Type: object
   * Default: {}
   */
  style?: React.CSSProperties
  /**
   * Whether to play or pause the marquee
   * Type: boolean
   * Default: true
   */
  play?: boolean
  /**
   * Whether to pause the marquee when hovered
   * Type: boolean
   * Default: false
   */
  pauseOnHover?: boolean
  /**
   * Whether to pause the marquee when clicked and held
   * Type: boolean
   * Default: false
   */
  pauseOnHold?: boolean
  /**
   * The direction the marquee is sliding
   * Type: "left" or "right"
   * Default: "left"
   */
  direction?: 'left' | 'right'
  /**
   * Speed calculated as pixels/second
   * Type: number
   * Default: 20
   */
  speed?: number
  /**
   * Duration to delay the animation after render, in seconds
   * Type: number
   * Default: 0
   */
  delay?: number
  /**
   * Whether to show the gradient or not
   * Type: boolean
   * Default: true
   */
  gradient?: boolean
  /**
   * The rgb color of the gradient as an array of length 3
   * Type: Array<number> of length 3
   * Default: [255, 255, 255]
   */
  gradientColor?: string
  /**
   * The width of the gradient on either side
   * Type: string
   * Default: 200
   */
  gradientWidth?: number | string
  /**
   * The children rendered inside the marquee
   * Type: ReactNode
   * Default: null
   */
  children?: React.ReactNode
  sx?: SxProps<Theme>
  onClick?: () => void
}

// tento komponent je z https://github.com/justin-chu/react-fast-marquee/blob/master/src/components/Marquee.tsx
// ale prepisali sme si ho MUI stylmi
export const Marquee: FC<MarqueeProps> = ({
  play = true,
  pauseOnHover = false,
  pauseOnHold = false,
  direction = 'left',
  speed = 20,
  delay = 0,
  gradient = true,
  gradientColor = [255, 255, 255],
  gradientWidth = 200,
  children,
  sx,
  onClick,
}) => {
  /* React Hooks */
  const [containerWidth, setContainerWidth] = useState(0)
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    /* Find width of container and width of marquee */
    if (marqueeRef.current && containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width)
      setMarqueeWidth(marqueeRef.current.getBoundingClientRect().width)
    }

    if (marqueeWidth < containerWidth) {
      setDuration(containerWidth / speed)
    } else {
      setDuration(marqueeWidth / speed)
    }
  })

  // Gradient color in an unfinished rgba format
  const rgbaGradientColor = `rgba(${gradientColor[0]}, ${gradientColor[1]}, ${gradientColor[2]}`

  const element = (
    <Stack
      ref={marqueeRef}
      direction="row"
      sx={{
        '@keyframes scroll': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(calc(-100% - var(--margin-right)))',
          },
        },

        // `animation` has to be defined first, next properties adjust its state
        animation: 'scroll var(--duration) linear var(--delay) infinite',
        animationDelay: 'var(--delay)',
        animationDirection: 'var(--direction)',
        marginRight: 'var(--margin-right)',

        animationPlayState: 'var(--play)',
      }}
    >
      {children}
    </Stack>
  )

  return (
    <>
      {!isMounted ? null : (
        <Stack
          ref={containerRef}
          direction="row"
          onClick={onClick}
          sx={{
            overflowX: 'hidden',
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: onClick ? 'pointer' : 'default',

            // `toFixed` fixes a weird bug with `duration` infinitely changing on pause
            '--duration': `${duration.toFixed(4)}s`,
            '--delay': `${delay}s`,
            '--direction': direction === 'left' ? 'normal' : 'reverse',
            '--margin-right': `${marqueeWidth < containerWidth ? containerWidth - marqueeWidth : 0}px`,

            '--play': play ? 'running' : 'paused',
            '&:hover': pauseOnHover ? {'--play': 'paused'} : {},
            '&:active': pauseOnHold ? {'--play': 'paused'} : {},

            ...sx,
          }}
        >
          {gradient && (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',

                '&::before, &::after': {
                  background: 'linear-gradient(to right, var(--gradient-color))',
                  content: '""',
                  height: '100%',
                  position: 'absolute',
                  width: 'var(--gradient-width)',
                  zIndex: 2,
                },

                '&::after': {
                  right: 0,
                  top: 0,
                  transform: 'rotateZ(180deg)',
                },

                '&::before': {
                  left: 0,
                  top: 0,
                },

                '--gradient-color': `${rgbaGradientColor}, 1), ${rgbaGradientColor}, 0)`,
                '--gradient-width': typeof gradientWidth === 'number' ? `${gradientWidth}px` : gradientWidth,
              }}
            />
          )}
          {element}
          {element}
        </Stack>
      )}
    </>
  )
}
