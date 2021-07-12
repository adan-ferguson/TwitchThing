const express = require('express')
const path = require('path')
const fs = require('fs')
const Twitch = require('../twitch/api')

const Users = require('../collections/users')

const router = express.Router()

router.get('/logout', (req, res) => {
  delete req.session.username
  res.redirect('/')
})

router.post('/gettwitchuser', async (req, res) => {
  const userInfo = await Twitch.getUserInfo(req.body.accessToken)
  if(!userInfo){
    res.send(Twitch.getLoginLink(req))
    return
  }
  const user = await Users.load(userInfo.login) || await Users.create(userInfo)
  req.session.username = userInfo.login
  res.send({ user: await user.gameData() })
})

router.get('/', (req, res) => {
  res.sendFile(getHtml('index'))
})

router.get('*', (req, res) => {
  const file = getHtml(req.url)
  console.log('file:', file)
  if(fs.existsSync(file)){
    res.sendFile(file)
  }else{
    res.redirect('/')
  }
})

function getHtml(file){
  return path.join(__dirname, '..', '..', 'client_dist', file + '.html')
}

module.exports = router