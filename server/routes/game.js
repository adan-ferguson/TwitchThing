import express from 'express'
import log from 'fancy-log'

import * as Users from '../collections/users.js'
import Channels from '../collections/channels.js'
import { create as createCharacter } from '../collections/characters.js'
import TwitchApi from '../twitch/api.js'

const router = express.Router()

// Make sure we're logged in.
router.use(async (req, res, next) => {
  if(!req.user){
    if(req.method === 'GET'){
      return res.redirect('/')
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

// Make sure we're allowed to play, and if not then redirect somewhere.
router.use((req, res, next) => {
  let redirect = false
  if(!Users.isSetupComplete(req.user)){
    redirect = '/user/newuser'
  }
  if(redirect){
    if(req.method === 'GET'){
      return res.redirect(redirect)
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

router.get('/', async(req, res) => {
  res.render('game', { user: req.user })
})

router.post('/settings', async(req, res) => {

  let channel = await Channels.load(req.user.username)
  const channelSettings = {}

  if(!channel || !await channel.accessTokenValid()){
    const { loginLink, stateID } = TwitchApi.getChannelAuthLink(req)
    channelSettings.authRequired = {
      loginLink,
      stateID
    }
  }else{
    channelSettings.channelDocument = channel.doc
  }

  res.send({
    channelSettings
  })
})

router.post('/savechannelauth', async(req, res) => {
  let channel = await Channels.load(req.user.username)
  if(!channel){
    channel = await Channels.add(req.user.username)
  }
  await channel.updateAccessToken(req.body.access_token)
  res.send(200)
})

router.post('/updatechannel', async(req, res) => {
  let channel = await Channels.load(req.user.username)
  if(!channel){
    return res.code(401)
  }
  channel.update(req.body)
  res.send(200)
})

router.post('/makecharacter', async(req, res) => {
  try {
    const character = await createCharacter(req.user, req.body.name)
    res.send(character)
  }catch(errors){
    return res.status(400).send({ errors })
  }
})

export default router