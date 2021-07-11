const express = require('express')

const Users = require('../collections/users')
const Bonuses = require('../collections/bonuses')
const Channels = require('../collections/channels')
const TwitchApi = require('../twitch/api')

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.session.username){
    res.status(401).send('Not logged in')
  }
  const user = await Users.load(req.session.username)
  if(!user){
    res.status(401).send('User not found')
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

  if(!channel || !await channel.accessTokenValid()){
    const { loginLink, stateID } = TwitchApi.getChannelAuthLink(req)
    channel = {
      requiresAuth: true,
      loginLink,
      stateID
    }
  }else{
    channel = channel.doc
  }

  res.send({
    channel
  })
})

router.post('/savechannelauth', async(req, res) => {
  let channel = await Channels.load(req.user.username)
  if(!channel){
    channel = await Channels.add(req.user.username)
  }
  channel.doc.accesToken = req.body.access_token
  channel.save()
  res.send(200)
})

module.exports = router