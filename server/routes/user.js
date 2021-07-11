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

  if(!channel){
    const { loginLink, stateID } = TwitchApi.getLoginLink(req,true)
    channel = {
      requiresAuth: true,
      loginLink,
      stateID
    }
  }

  res.send({
    channel
  })
})

module.exports = router