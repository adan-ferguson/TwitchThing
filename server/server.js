import express from 'express'
import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'

import log from 'fancy-log'

import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import publicRouter from './routes/public.js'

import { setup as setupSocketServer } from './socketServer.js'
import config from '../config.js'

async function init(){

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
  })
  redisClient.on('error', function (err) {
    log('Could not establish a connection with redis. ' + err)
  })
  redisClient.on('connect', function () {
    log('Connected to redis successfully')
  })

  const sessionMiddlware = session({
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: true,
    secret: config.secret,
    cookie: {
      secure: config.requireHttps
    }
  })

  const app = express()
    .set('trust proxy', 1)
    .use(sessionMiddlware)
    .use(express.json())
    .use('/user', userRouter)
    .use('/admin', adminRouter)
    .use('/', publicRouter)
    .use('/', express.static('client_dist'))

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