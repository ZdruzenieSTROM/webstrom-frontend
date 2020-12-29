import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'

import {Webstrom} from './Webstrom'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Webstrom />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
