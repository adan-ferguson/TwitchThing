const express = require('express')
const path = require('path')
const router = express.Router()
const Twitch = require('./twitch')
const User = require('./db_models/user')

router.post('/gettwitchuser', async (req, res) => {
  const userInfo = await Twitch.getUserInfo(req.body.accessToken)
  if(!userInfo){
    res.send(Twitch.getLoginLink(req))
  }
  const user = await User.load(userInfo.id) || await User.create(userInfo)
  await User.loadExtendedInfo(user)
  req.session.userid = userInfo.twitchId
  res.send({ user: user })
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