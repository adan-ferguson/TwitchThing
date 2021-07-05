import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'
import './loadIcons'
import { connect } from './socketClient'

connect()

ReactDOM.render(<App />, document.querySelector('#root'))
