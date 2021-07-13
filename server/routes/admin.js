const express = require('express')
const log = require('fancy-log')

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.session.username || req.session.username !== 'khananaphone'){
    log(req.session.username + ' tried to acccess admin page LOL.')
    return res.status(403).send('Forbidden')
  }
  next()
})

router.post('/*', (req, res) => {
  res.send('yay')
})

router.get('/*', (req, res) => {
  res.status(403).send('Forbidden')
})

module.exports = router