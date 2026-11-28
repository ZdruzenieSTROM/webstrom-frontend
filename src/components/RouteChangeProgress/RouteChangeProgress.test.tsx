import {act, render, screen} from '@testing-library/react'
import mockRouter from 'next-router-mock'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {RouteChangeProgress} from './RouteChangeProgress'

type RouterEvent = Parameters<typeof mockRouter.events.emit>[0]

const emit = (event: RouterEvent, ...args: unknown[]) => act(() => mockRouter.events.emit(event, ...args))
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))
const queryBar = () => screen.queryByRole('progressbar', {name: 'Načítava sa stránka'})

describe('RouteChangeProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    render(<RouteChangeProgress />)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should show the bar only when a navigation takes longer than 150 ms', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(149)
    expect(queryBar()).toBeNull()

    advance(1)
    expect(queryBar()).not.toBeNull()
  })

  it('should never show the bar when a navigation completes within 150 ms', () => {
    emit('routeChangeStart', '/matik/kalendar')
    advance(100)
    emit('routeChangeComplete', '/matik/kalendar')
    advance(1000)

    expect(queryBar()).toBeNull()
  })

  it('should hide the bar when the navigation completes', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(200)
    emit('routeChangeComplete', '/matik/poradie')

    expect(queryBar()).toBeNull()
  })

  it('should hide the bar at once when the navigation fails', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(200)
    emit('routeChangeError', new Error('Failed to load'), '/matik/poradie')

    expect(queryBar()).toBeNull()
  })

  it('should keep the bar on when a repeated click cancels the in-flight navigation', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(200)
    emit('routeChangeError', Object.assign(new Error('Route Cancelled'), {cancelled: true}), '/matik/poradie')
    emit('routeChangeStart', '/matik/poradie')
    advance(100)

    expect(queryBar()).not.toBeNull()
  })

  it('should hide the bar when a cancelled navigation is not followed by a new one', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(200)
    emit('routeChangeError', Object.assign(new Error('Route Cancelled'), {cancelled: true}), '/matik/poradie')
    advance(1)

    expect(queryBar()).toBeNull()
  })

  it('should hide the bar when the navigation trap aborts the navigation', () => {
    emit('routeChangeStart', '/matik/poradie')
    advance(200)
    emit('routeChangeError', '', '', {shallow: false})

    expect(queryBar()).toBeNull()
  })
})
