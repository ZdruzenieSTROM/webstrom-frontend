import axios, {AxiosError} from 'axios'
import {FC, FormEvent, SyntheticEvent, useEffect, useRef, useState} from 'react'
import {useCookies} from 'react-cookie'

import {Login, Token} from '@/types/api/generated/user'
import {WebstromTokenContainer} from '@/utils/WebstromTokenContainer'

import styles from './LoginForm.module.scss'

interface ILoginForm {
  closeOverlay: () => void
}

export const LoginForm: FC<ILoginForm> = ({closeOverlay}) => {
  const [formData, setFormData] = useState<Login>({email: '', password: ''})
  const [, setCookie] = useCookies(['webstrom-token'])
  const emailRef = useRef<HTMLInputElement>(null)
  const {setWebstromToken} = WebstromTokenContainer.useContainer()

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setFormData((prevData) => ({...prevData, [name]: value}))
  }

  const handleLogin = async (event: SyntheticEvent) => {
    event.preventDefault()

    try {
      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + 1)

      const {data} = await axios.post<Token>('/api/user/login/', formData)

      setCookie('webstrom-token', data.key, {path: '/', expires: expirationDate})
      setWebstromToken(data.key)

      closeOverlay()
    } catch (e: unknown) {
      const error = e as AxiosError
      if (error.response?.status === 400) {
        // console.log('Neplatné prihlasovacie údaje')
      }
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className={styles.loginForm}>
          <div>
            <input
              ref={emailRef}
              type="text"
              name="email"
              placeholder="e-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="heslo"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button>
            <span className={styles.underline}>Prihlásiť</span>
          </button>
        </div>
      </form>
    </>
  )
}
