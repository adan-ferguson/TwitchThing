import express from 'express'
import session from 'express-session'
import passport from 'passport'

import log from 'fancy-log'

import gameRouter from './routes/game/index.js'
import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import publicRouter from './routes/public.js'
import watchRouter from './routes/watch.js'

import { setup as setupSocketServer } from './socketServer.js'
import config from './config.js'
import { fileURLToPath } from 'url'
import path from 'path'
import DB from './db.js'
import MongoStore from 'connect-mongo'
import errorHandler from './errorHandler.js'

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
    .use(sessionMiddlware)
    .use(express.json())
    .use(passport.initialize({}))
    .use(passport.session({}))
    .use('/game', gameRouter)
    .use('/user', userRouter)
    .use('/admin', adminRouter)
    .use('/watch', watchRouter)
    .use('/', publicRouter)
    .use('/', express.static('client_dist'))
    .use(errorHandler)

  try {
    const server = app.listen(config.port, () => {
      log('Server running', config.port)
    })
    setupSocketServer(server, sessionMiddlware)
  }catch(ex){
    log(ex)
    log('Server failed to load.')
  }
}

export default { init }