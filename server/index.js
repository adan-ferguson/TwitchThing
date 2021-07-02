const express = require('express')
const app = express()
const config = require('./config')
const session = require('express-session')
const db = require('./db')
const path = require('path')
const Chatbot = require('./chatbot')
const Channels = require('./collections/channels')

app
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

db.init().then(() => {
  Chatbot.init()
  Channels.init()
  const PORT = config.port
  app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
  })
})