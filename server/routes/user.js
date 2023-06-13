import express from 'express'
import { Magic } from '@magic-sdk/admin'
import config from '../config.js'
import Users from '../collections/users.js'
import passport from 'passport'
import { Strategy } from 'passport-magic'
import CustomStrategy from 'passport-custom'
import { OAuthExtension } from '@magic-ext/oauth'
import { checkForRewards } from '../user/rewards.js'

const router = express.Router()

const magic = new Magic(config.magic.secretKey, {
  extensions: [new OAuthExtension()]
})

passport.use(new Strategy(async function(magicUser, done){
  try {
    let user = await Users.loadFromMagicID(magicUser.issuer)
    if(!user){
      const userMetadata = await magic.users.getMetadataByIssuer(magicUser.issuer)
      user = await Users.create(magicUser.issuer, magicUser.claim.iat, userMetadata.email, userMetadata.oauthProvider || 'magiclink')
    }else{
      Users.login(user)
    }
    return done(null, user)
  }catch(err){
    return done(err)
  }
}))

passport.use('anonymous', new CustomStrategy(async (req, cb) => {
  const user = req.user ?? await Users.createAnonymous()
  cb(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, { userID: user._id })
})

passport.deserializeUser(async (obj, done) => {
  done(null, await Users.deserializeFromSession(obj))
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
    if(req.user.magicID){
      await magic.users.logoutByIssuer(req.user.magicID)
    }
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

router.get('/newuseranonymous', passport.authenticate('anonymous'), async (req, res) => {
  res.redirect('/user/newuser')
})

router.post('/appfetch', async (req, res) => {
  const user = Users.gameData(req.user) || { anonymous: true }
  const popups = user.anonymous ? [] : checkForRewards(req.user)
  res.send({ user, popups })
})

export default router