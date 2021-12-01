import express from 'express'
import { Magic } from '@magic-sdk/admin'
import config from '../config.js'
import * as Users from '../collections/users.js'
import passport from 'passport'
import { Strategy } from 'passport-magic'

const router = express.Router()
const magic = new Magic(config.magic.secretKey)

const strategy = new Strategy(async function(magicUser, done){
  try {
    // do we need this?
    // const userMetadata = await magic.users.getMetadataByIssuer(magicUser.issuer)
    let user = await Users.load(magicUser.issuer)
    if(!user){
      user = await Users.create(magicUser.issuer, magicUser.claim.iat)
    }else{
      Users.login(user)
    }
    return done(null, user)
  }catch(err){
    return done(err)
  }
})

passport.use(strategy)

passport.serializeUser((user, done) => {
  done(null, user.magicID)
})

passport.deserializeUser(async (id, done) => {
  const user = await Users.load(id)
  if(user){
    done(null, user)
  }else{
    done('User not found', null)
  }
})

router.post('/login', passport.authenticate('magic'), (req, res) => {
  if(req.user){
    res.status(200).end('User is logged in.')
  }else{
    res.status(401).end('Could not log user in.')
  }
})

router.get('/logout', async (req, res) => {
  if(req.isAuthenticated()){
    await magic.users.logoutByIssuer(req.user.magicID)
    req.logout()
  }
  res.redirect('/')
})

export default router