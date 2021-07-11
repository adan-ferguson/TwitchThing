const express = require('express')
const path = require('path')

const Users = require('../collections/users')
const Bonuses = require('../collections/bonuses')

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.session.username){
    res.status(401).send('Not logged in')
  }
  const user = await Users.load(req.session.username)
  if(!user){
    res.status(401).send('User not found')
  }
  next()
})

router.post('/bonuses', async(req, res) => {
  const bonuses = await Bonuses.loadRecent(req.session.username)
  res.send(bonuses)
})

router.get('/settings', (req, res) => {
  res.sendFile(getHtml('settings'))
})

function getHtml(file){
  return path.join(process.cwd(), 'client_dist', file + '.html')
}
module.exports = router