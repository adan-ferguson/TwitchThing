const express = require('express')
const session = require('express-session')
const path = require('path')
const https = require('https')
const log = require('fancy-log')
const fs = require('fs')

const config = require('../config/config.json')

async function init(){

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

  try {
    https.createServer({
      key: fs.readFileSync('../config/key.pem'),
      cert: fs.readFileSync('../config/cert.pem'),
      passphrase: config.sslCertPassPhrase
    }, app).listen(config.port, () => {
      log('Server running', config.port)
    })
  }catch(ex){
    log(ex)
    log('Server failed to load.')
  }
}

module.exports = {
  init
}