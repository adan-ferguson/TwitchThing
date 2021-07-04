const express = require('express')
const session = require('express-session')
const path = require('path')
const https = require('https')
const log = require('fancy-log')
const fs = require('fs')

const config = require('../config/config.json')

async function init(){

  const sessionMiddlware = session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    cookie: {
      secure: true
    }
  })

  const app = express()
    .use(sessionMiddlware)
    .use(express.json())
    .use('', express.static(path.join(__dirname, '..', 'client_dist')))
    .use('/', require('./routes/public.js'))
    .use('/user/', require('./routes/user.js'))


  try {
    const server = https.createServer({
      key: fs.readFileSync('../config/key.pem'),
      cert: fs.readFileSync('../config/cert.pem'),
      passphrase: config.sslCertPassPhrase
    }, app).listen(config.port, () => {
      log('Server running', config.port)
    })

    require('./socketServer').setup(server, sessionMiddlware)
  }catch(ex){
    log(ex)
    log('Server failed to load.')
  }
}

module.exports = {
  init
}