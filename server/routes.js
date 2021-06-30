const express = require('express')
const path = require('path')
const router = express.Router()
const Twitch = require('./twitch')
const User = require('./db_models/user')

router.post('/gettwitchuser', (req, res) => {
  const result = req.body.accessToken ? User.load(req.session.userid) : Twitch.getLoginLink(req)
  res.send(result)
})

router.get('/twitchredirect', (req, res) => {
  res.sendFile(getHtml('twitchredirect'))
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