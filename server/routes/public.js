import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import Twitch from '../twitch/api.js'

import Users from '../collections/users.js'

const router = express.Router()

router.get('/logout', (req, res) => {
  delete req.session.username
  res.redirect('/')
})

router.post('/getuser', async (req, res) => {
  if(!req.session.username){
    return res.send({})
  }
  const user = await Users.load(req.session.username)
  if(!user){
    return res.send({})
  }
  res.send(await user.gameData())

  // if(userInfo){
  //   Users.loadFromUserInfo(userInfo)
  // }
  //
  // await Twitch.getUserInfo(req.body.accessToken)
  // if(!userInfo){
  //   res.send(Twitch.getLoginLink(req))
  //   return
  // }
  // const user = await Users.load(userInfo.login) || await Users.create(userInfo)
  // req.session.username = userInfo.login
  // req.session.save()
  // res.send({ user: await user.gameData() })
})

router.get('/', (req, res) => {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    res.sendFile(getHtml('index'))
  }
})

router.get('*', (req, res, next) => {
  const file = getHtml(req.url)
  if(fs.existsSync(file)){
    res.sendFile(file)
  }else{
    next()
  }
})

function getHtml(file){
  return path.join(__dirname, '../../client_dist/html', file + '.html')
}

export default router