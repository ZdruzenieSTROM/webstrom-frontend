import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {Cookies} from 'react-cookie'
import {createContainer} from 'unstated-next'

import {Login, Token} from '@/types/api/generated/user'
import {Profile} from '@/types/api/personal'

// special axios instance to prevent interceptors
const specialAxios = axios.create()

// call na lubovolny "auth" endpoint ako test prihlasenia, vracia true/false podla uspesnosti
const testAuth = async () => {
  try {
    await specialAxios.get<Profile>(`/api/personal/profiles/myprofile`)
    return true
  } catch (e: unknown) {
    console.log((e as AxiosError).response?.data)
    return false
  }
}

const cookies = new Cookies()

const useAuth = () => {
  // stav, ktory napoveda, ci mame sessionid cookie a vieme robit auth requesty
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // zistime, ci ma user platne sessionid - request na nejaky autentikovany endpoint
    ;(async () => {
      const success = await testAuth()
      success && setIsAuthed(true)
    })()

    // interceptor pre auth
    axios.interceptors.request.use((config) => {
      config.headers = config.headers ?? {}
      // auth pozostava z comba:
      // 1. `sessionid` httpOnly cookie ktoru nastavuje aj maze server pri login/logout
      // 2. tato CSRF hlavicka, ktora ma obsahovat cookie, ktoru nastavuje server
      config.headers['X-CSRFToken'] = cookies.get('csrftoken')

      return config
    })

    // one-time vec pri prvom nacitani stranky
  }, [])

  // 403 (Forbidden) mozeme dostat, ked pristupujeme k niecomu, na co:
  // - treba auth, ale my nie sme prihlaseni
  // - treba auth a aj mame prava, ale nasa auth vyprsala (stare/vadne session id)
  // - treba auth a sice sme prihlaseni, ale nemame prava (napr. snaha o prihlasenie sa do stareho semestra)
  useEffect(() => {
    if (isAuthed) {
      // ked sme authed a dostaneme 403, chceme overit, ci nam vyprsalo prihlasenie - ak hej, chceme odhlasit usera, nech vie, co sa deje
      const responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const status = error.response?.status

          if (status === 403) {
            // bud nemame prava, alebo nam vyprsala auth
            // auth requestom na profil zistime, co z toho
            const success = await testAuth()

            // ak zlyha, tak nam vyprsala auth
            if (!success) {
              // odhlásime usera z UI
              setIsAuthed(false)
            }
            // ak prejde, tak sme len requestovali resource, na ktory nemame prava, ale sme stale validne prihlaseni,
            // tak netreba robit nic. appka nam snad da vediet, ze sa hrabeme, kam nemame
          }

          return Promise.reject(error)
        },
      )

      // useEffect unmount callback
      return () => {
        axios.interceptors.response.eject(responseInterceptor)
      }
    }
  }, [isAuthed])

  const {mutate: login} = useMutation({
    mutationFn: ({data}: {data: Login; onSuccess: () => void}) => axios.post<Token>('/api/user/login/', data),
    onSuccess: async (_, {onSuccess}) => {
      onSuccess()

      // testAuth ma vlastny error handling, necrashne
      const success = await testAuth()
      success && setIsAuthed(true)
    },
  })

  // zavoláme logout API point, ktorý zmaže token na BE a odstráni sessionid cookie.
  const {mutate: logout} = useMutation({
    mutationFn: () => axios.post('/api/user/logout'),
    onSettled: () => {
      setIsAuthed(false)
      // sessionid cookie odstrani server sam
    },
  })

  const queryClient = useQueryClient()

  // globalne miesto na invalidaciu (refetch) dat pri prihlaseni alebo odhlaseni
  // - treba refetchnut vsetky queries, kto obsahuju user-specific data
  useEffect(() => {
    // semestre obsahuju can_submit, can_participate, is_registered
    queryClient.invalidateQueries({queryKey: ['competition', 'series']})
    // problemy obsahuju komentare a tie maju flagy ako edit_allowed
    queryClient.invalidateQueries({queryKey: ['competition', 'problem']})
    // cely profil je user-specific
    // nestaci invalidate - ten by nechal stare data aktivne, kym sa podari fetchnut nove, ale tato query v non-auth stave zlyha
    queryClient.removeQueries({queryKey: ['personal', 'profiles', 'myprofile']})

    // nechceme manualne invalidovat, ked sa zmeni nieco ine ako `isAuthed` (aj ked `queryClient` by sa menit nemal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  return {isAuthed, login, logout}
}

export const AuthContainer = createContainer(useAuth)
