import './LoginForm.scss'

import axios from 'axios'
import React, {useState} from 'react'
import {useCookies} from 'react-cookie'

interface ILoginForm {
  overlayToggle: () => void
  loginRegistrationToggle: () => void
}

export const LoginForm: React.FC<ILoginForm> = ({overlayToggle, loginRegistrationToggle}) => {
  const [formData, setFormData] = useState({email: '', password: ''})
  const [, setCookie] = useCookies(['webstrom-token'])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    setFormData((prevData) => {
      const newData = {...prevData, [name]: value}
      return newData
    })
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

      overlayToggle()
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
            <input type="text" name="email" placeholder="e-mail" value={formData.email} onChange={handleChange} />
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
