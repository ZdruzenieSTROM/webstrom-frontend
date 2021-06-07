import './index.css'

import axios from 'axios'
import React from 'react'
import {Cookies} from 'react-cookie'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'

import {Webstrom} from './Webstrom'

const cookies = new Cookies()

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Webstrom />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

axios.interceptors.request.use((request) => {
  // Interceptor ktorý pridá webstrom-token do autorizačného headera
  const key = cookies.get('webstrom-token')
  if (key !== undefined) {
    request.headers.Authorization = `Token ${key}`
  }
  return request
})
