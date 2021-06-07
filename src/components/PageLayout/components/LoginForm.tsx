import './LoginForm.scss'

import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import {useCookies} from 'react-cookie'

interface ILoginForm {
  closeOverlay: () => void
  loginRegistrationToggle: () => void
}

export const LoginForm: React.FC<ILoginForm> = ({closeOverlay, loginRegistrationToggle}) => {
  const [formData, setFormData] = useState({email: '', password: ''})
  const [, setCookie] = useCookies(['webstrom-token'])
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setFormData((prevData) => ({...prevData, [name]: value}))
  }

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + 1)

      const response = await axios.post('/api/user/login/', formData)
      setCookie('webstrom-token', response.data['key'], {path: '/', expires: expirationDate})

      const responseDetails = await axios.get('/api/personal/profiles/myprofile/')
      setCookie('webstrom-name', responseDetails.data['first_name'], {path: '/', expires: expirationDate})

      closeOverlay()
    } catch (error) {
      if (error.response.status === 400) {
        console.log('Neplatné prihlasovacie údaje')
      }
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <div id="login-form">
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
            <span className="underline">Prihlásiť</span>
          </button>
        </div>
      </form>
    </>
  )
}
