import {FC, FormEvent, FormEventHandler, useEffect, useRef, useState} from 'react'

import {Login} from '@/types/api/generated/user'
import {AuthContainer} from '@/utils/AuthContainer'

import styles from './LoginForm.module.scss'

interface ILoginForm {
  closeOverlay: () => void
}

export const LoginForm: FC<ILoginForm> = ({closeOverlay}) => {
  const [formData, setFormData] = useState<Login>({email: '', password: ''})
  const emailRef = useRef<HTMLInputElement>(null)
  const {login} = AuthContainer.useContainer()

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setFormData((prevData) => ({...prevData, [name]: value}))
  }

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    // ak to tu nie je, robi to weird veci- prida to email a password do URL
    // ako query parametre, refreshne stranku a vobec nestihne pustit nas kod
    e.preventDefault()
    await login(formData, closeOverlay)
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
