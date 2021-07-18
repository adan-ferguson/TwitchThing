import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app.js'
import './loadIcons.js'
import { connect } from './socketClient.js'
import { showLoader } from './misc/loaderOverlay.js'

showLoader()

connect()

ReactDOM.render(<App />, document.querySelector('#root'))
