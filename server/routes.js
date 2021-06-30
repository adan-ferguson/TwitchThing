const express = require('express')
const path = require('path')
const router = express.Router()
const twitch = require('./twitch')

router.get('', (req, res) => {
  res.locals.twitch = twitch.getTwitchInfo(req)
  res.sendFile(path.join(__dirname, '..', 'client_dist', 'index.html'))
})

router.get('*', (req, res) => {
  res.redirect('/')
})

module.exports = router