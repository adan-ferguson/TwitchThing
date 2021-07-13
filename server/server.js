const express = require('express')
const session = require('express-session')
const path = require('path')
const log = require('fancy-log')

const config = require('../config.json')

async function init(){

  const sessionMiddlware = session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    cookie: {
      secure: config.requireHttps
    }
  })

  const app = express()
    .use(sessionMiddlware)
    .use(express.json())
    .use('/', express.static(path.join(__dirname, '..', 'client_dist')))
    .use('/user', require('./routes/user.js'))
    .use('/admin', require('./routes/admin.js'))
    // .use('/channel', require('./routes/channel.js'))
    .use('/', require('./routes/public.js'))


  try {
    const server = app.listen(config.port, () => {
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