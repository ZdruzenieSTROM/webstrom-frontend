import axios from 'axios'

import {apiInterceptor} from '@/api/apiInterceptor'
import {debugServer} from '@/utils/debugServer'
import {getBackendServerUrl} from '@/utils/urlBase'

export const newApiAxios = (base: 'server' | 'client') => {
  const instance = axios.create({
    // axios requesty mozu byt z FE next serveru alebo z browsru.
    // - server vola BE URL (podla env vars) priamo
    // - browser vola lokalnu /api URL
    //   - na deployed verzii (test.strom.sk, strom.sk) to chyti nginx a posle na deployed BE
    //   - na localhoste to chyti next middleware, kde to rewritneme na BE URL (podla env vars)
    baseURL: base === 'server' ? `${getBackendServerUrl()}/api` : '/api',
    // auth pozostava z comba:
    // 1. `sessionid` httpOnly cookie - nastavuje a maze su server pri login/logout
    // 2. CSRF hlavicka - server nastavuje cookie, ktorej hodnotu treba vlozit do hlavicky. axios riesi automaticky podla tohto configu
    withXSRFToken: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    // bez tohto sa neposielaju v requeste cookies
    withCredentials: true,
  })

  if (base === 'server') {
    // prvy definovany interceptor bezi posledny. logujeme finalnu URL
    instance.interceptors.request.use((config) => {
      const {method, url, baseURL} = config

      debugServer('[SERVER API]', method?.toUpperCase(), url && baseURL ? new URL(url, baseURL).href : url)

      // server-side requesty z deployed FE na deployed BE potrebuju tieto hlavicky
      // TODO: ked pojdeme do produkcie, asi bude treba riesit nejakym env varom
      config.headers['X-Forwarded-Host'] = 'test.strom.sk'
      config.headers['X-Forwarded-Proto'] = 'https'

      return config
    })
  }

  instance.interceptors.request.use(apiInterceptor)

  return instance
}

// nasa "globalna" API instancia
export const apiAxios = newApiAxios('client')

export const serverApiAxios = newApiAxios('server')
