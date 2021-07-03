const express = require('express')
const session = require('express-session')
const path = require('path')
const https = require('https')
const fs = require('fs')

const config = require('../config/config')

function init(){
  return new Promise(res => {

    const app = express()
      .use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.secret,
        cookie: {
          secure: true
        }
      }))
      .use(express.json())
      .use('/', express.static(path.join(__dirname, '..', 'client_dist')))
      .use('/', require('./routes.js'))

    const credentials = {
      key: fs.readFileSync('../config/key.pem'),
      cert: fs.readFileSync('../config/cert.pem')
    }

    const PORT = config.port
    https.createServer(credentials, app).listen(PORT, () => {
      console.log(`App listening to ${PORT}....`)
      res()
    })
  })
}

module.exports = {
  init
}