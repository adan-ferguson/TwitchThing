import express from 'express'
import session from 'express-session'
import log from 'fancy-log'

import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import publicRouter from './routes/public.js'

import { setup as setupSocketServer } from './socketServer.js'
import config from '../config.js'

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
    .use('/', express.static('client_dist'))
    .use('/user', userRouter)
    .use('/admin', adminRouter)
    // .use('/channel', import('./routes/channel.js'))
    .use('/', publicRouter)


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