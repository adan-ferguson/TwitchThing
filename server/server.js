import express from 'express'
import session from 'express-session'
import passport from 'passport'

import log from 'fancy-log'

import gameRouter from './routes/game.js'
import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import publicRouter from './routes/public.js'

import { setup as setupSocketServer } from './socketServer.js'
import config from '../config.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function init(){

  const sessionMiddlware = session({
    resave: false,
    saveUninitialized: true,
    secret: config.secret,
    cookie: {
      secure: config.requireHttps,
      sameSite: true
    }
  })

  const app = express()
    .set('trust proxy', 1)
    .set('view engine', 'ejs')
    .set('views', path.join(__dirname, '../client/views'))
    .use(sessionMiddlware)
    .use(express.json())
    .use('/game', gameRouter)
    .use('/user', userRouter)
    .use('/admin', adminRouter)
    .use('/', publicRouter)
    .use('/', express.static('client_dist'))
    .use(passport.initialize())
    .use(passport.session())

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