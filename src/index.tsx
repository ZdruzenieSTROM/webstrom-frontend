import './index.css'

import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'

import {Webstrom} from './Webstrom'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Webstrom />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
