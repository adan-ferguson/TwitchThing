const express = require('express')
const path = require('path')
const router = express.Router()
const Twitch = require('./twitch')

const Users = require('./collections/users')
const Bonuses = require('./collections/bonuses')

router.post('/gettwitchuser', async (req, res) => {
  const userInfo = await Twitch.getUserInfo(req.body.accessToken)
  if(!userInfo){
    res.send(Twitch.getLoginLink(req))
  }
  const user = await Users.load(userInfo.login) || await Users.create(userInfo)
  req.session.username = userInfo.username
  res.send({ user: await user.gameData() })
})

router.post('/bonuses', async(req, res) => {
  res.send(await Bonuses.loadRecent(req.session.username))
})

router.get('/twitchredirect', (req, res) => {
  res.sendFile(getHtml('twitchredirect'))
})

router.get('/logout', (req, res) => {
  delete req.session.userid
  res.redirect('/')
})

router.get('/', (req, res) => {
  res.sendFile(getHtml('index'))
})

router.get('*', (req, res) => {
  res.redirect('/')
})

function getHtml(file){
  return path.join(__dirname, '..', 'client_dist', file + '.html')
}

module.exports = router