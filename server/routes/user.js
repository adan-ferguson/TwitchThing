import express from 'express'
import { Magic } from '@magic-sdk/admin'
import config from '../config.js'
import Users from '../collections/users.js'
import passport from 'passport'
import { Strategy } from 'passport-magic'

const router = express.Router()

const magic = new Magic(config.magic.secretKey)
const strategy = new Strategy(async function(magicUser, done){
  try {
    let user = await Users.loadFromMagicID(magicUser.issuer)
    if(!user){
      const userMetadata = await magic.users.getMetadataByIssuer(magicUser.issuer)
      user = await Users.create(magicUser.issuer, magicUser.claim.iat, userMetadata.email)
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
  const user = await Users.loadFromMagicID(id)
  done(null, user)
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

router.get('/newuser', async (req, res) => {

  if(!req.user){
    return res.redirect('/login')
  }

  if(req.user.displayname){
    return res.redirect('/game')
  }

  let err = null
  if(req.query && req.query.displayname){
    err = await Users.setDisplayname(req.user, req.query.displayname)
    if(!err){
      return res.redirect('/game')
    }
  }
  res.render('newuser', { error: err })
})

router.post('', async (req, res) => {
  res.send(Users.gameData(req.user))
})

export default router