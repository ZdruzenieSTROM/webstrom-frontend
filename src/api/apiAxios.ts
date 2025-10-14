import axios from 'axios'
import type {GetServerSidePropsContext} from 'next'

import {apiInterceptor} from '@/api/apiInterceptor'
import {debugServer} from '@/utils/debugServer'
import {getBackendServerUrl} from '@/utils/urlBase'

// Helper to normalize header value (can be string or string[])
const normalizeHeader = (value: string | string[] | undefined): string | undefined => {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

export const newApiAxios = (req?: GetServerSidePropsContext['req']) => {
  const isServer = typeof window === 'undefined'

  // Extract only essential auth headers from request
  const authHeaders: Record<string, string> = {}
  if (req?.headers) {
    // Session cookies (sessionid, csrftoken) - essential for Django auth
    const cookie = normalizeHeader(req.headers.cookie)
    if (cookie) authHeaders.cookie = cookie

    // CSRF token header - forward if client already sent it (safer than relying on axios auto-generation in SSR)
    const csrfToken = normalizeHeader(req.headers['x-csrftoken'])
    if (csrfToken) authHeaders['X-CSRFToken'] = csrfToken
  }

  const instance = axios.create({
    // axios requesty mozu byt z FE next serveru alebo z browsru.
    // - server vola BE URL (podla env vars) priamo
    // - browser vola lokalnu /api URL
    //   - na deployed verzii (test.strom.sk, strom.sk) to chyti nginx a posle na deployed BE
    //   - na localhoste to chyti next middleware, kde to rewritneme na BE URL (podla env vars)
    baseURL: isServer ? `${getBackendServerUrl()}/api` : '/api',
    // auth pozostava z comba:
    // 1. `sessionid` httpOnly cookie - nastavuje a maze ju server pri login/logout
    // 2. CSRF hlavicka - server nastavuje cookie, ktorej hodnotu treba vlozit do hlavicky. axios riesi automaticky podla tohto configu
    withXSRFToken: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    // Browser - s tymto automaticky zahrnie v client requeste cookies
    withCredentials: true,
    // Server - headery musime takto explicitne zahrnut sami
    headers: authHeaders,
  })

  if (isServer) {
    // prvy definovany interceptor bezi posledny. logujeme finalnu URL
    instance.interceptors.request.use((config) => {
      const {method, url, baseURL} = config

      debugServer('[SERVER API]', method?.toUpperCase(), baseURL, url)

      // server-side requesty z deployed FE na deployed BE potrebuju tieto hlavicky (podla settings_test.py)
      config.headers['X-Forwarded-Host'] = process.env.BE_FORWARDED_HOST
      config.headers['X-Forwarded-Proto'] = process.env.BE_FORWARDED_PROTO

      return config
    })
  }

  instance.interceptors.request.use(apiInterceptor)

  return instance
}

// nasa "globalna" API instancia
export const apiAxios = newApiAxios()
