import express from 'express'
import session from 'express-session'
import passport from 'passport'

import gameRouter from './routes/game/index.js'
import userRouter from './routes/user.js'
import publicRouter from './routes/public.js'

import { setup as setupSocketServer } from './socketServer.js'
import config from './config.js'
import { fileURLToPath } from 'url'
import path from 'path'
import DB from './db.js'
import MongoStore from 'connect-mongo'
import errorHandler from './errorHandler.js'
import favicon from 'serve-favicon'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function init(){

  const sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: config.secret,
    cookie: {
      secure: false
    },
    store: MongoStore.create({
      client: DB.client(),
      dbName: config.db.name
    })
  }

  if(config.requireHttps){
    sessionOptions.cookie.secure = true
    sessionOptions.proxy = true
  }

  const sessionMiddlware = session(sessionOptions)

  const app = express()
    .set('trust proxy', 1)
    .set('view engine', 'ejs')
    .set('views', path.join(__dirname, '../client/views'))
    .use(favicon(path.join(__dirname, '../favicon.ico')))
    .use(sessionMiddlware)
    .use(express.json())
    .use(passport.initialize({}))
    .use(passport.session({}))
    .use('/game', gameRouter)
    .use('/user', userRouter)
    .use('/', publicRouter)
    .use('/', express.static('client_dist'))
    .get(new RegExp('.*'), (req, res) => {
      res.redirect('/')
    })
    .use(errorHandler)

  try {
    const server = app.listen(config.port, () => {
      console.log('Server running', config.port)
    })
    setupSocketServer(server, sessionMiddlware)
  }catch(ex){
    console.log(ex)
    console.log('Server failed to load.')
  }
}

export default { init }