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
    console.log('magicUser', magicUser)
    let user = await Users.loadFromMagicID(magicUser.issuer)
    console.log('userb', user)
    if(!user){
      const userMetadata = await magic.users.getMetadataByIssuer(magicUser.issuer)
      console.log('meta', userMetadata)
      user = await Users.create(magicUser.issuer, magicUser.claim.iat, userMetadata.email)
    }else{
      Users.login(user)
    }
    console.log('usera', user)
    return done(null, user)
  }catch(err){
    return done(err)
  }
})

passport.use(strategy)

passport.serializeUser((user, done) => {
  console.log('ser', user, user.magicID)
  done(null, user.magicID)
})

passport.deserializeUser(async (id, done) => {
  const user = await Users.loadFromMagicID(id)
  console.log('deser', id, user)
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

  console.log('newuser', req.user)

  if(!req.user){
    return res.redirect('/login')
  }

  if(req.user.displayname){
    return res.redirect('/game')
  }

  let err = null
  if(req.query && req.query.displayname){
    err = await Users.setDisplayname(req.user, req.query.displayname)
    if(!err) {
      return res.redirect('/game')
    }
  }
  res.render('newuser', { error: err })
})

router.post('', async (req, res) => {
  res.send(await Users.loadGameData(req.user))
})

export default router