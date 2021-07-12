const express = require('express')

const Users = require('../collections/users')
const Bonuses = require('../collections/bonuses')
const Channels = require('../collections/channels')
const TwitchApi = require('../twitch/api')

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.session.username){
    return res.status(401).send('Not logged in')
  }
  const user = await Users.load(req.session.username)
  if(!user){
    return res.status(401).send('User not found')
  }
  req.user = user
  next()
})

router.post('/bonuses', async(req, res) => {
  const bonuses = await Bonuses.loadRecent(req.user.username)
  res.send(bonuses)
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

module.exports = router