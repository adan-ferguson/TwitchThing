import express from 'express'
import config from '../config.js'

const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login', {
    magicPublishableKey: config.magic.publishableKey
  })
})

router.get('/', (req, res) => {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

// router.post('/getuser', async (req, res) => {
//
//   if(!req.session.username){
//     return res.send({})
//   }
//
//   const user = await Users.load(req.session.username)
//   if(!user){
//     return res.send({})
//   }
//
//   res.send(await user.gameData())
//
//   // if(userInfo){
//   //   Users.loadFromUserInfo(userInfo)
//   // }
//   //
//   // await Twitch.getUserInfo(req.body.accessToken)
//   // if(!userInfo){
//   //   res.send(Twitch.getLoginLink(req))
//   //   return
//   // }
//   // const user = await Users.load(userInfo.login) || await Users.create(userInfo)
//   // req.session.username = userInfo.login
//   // req.session.save()
//   // res.send({ user: await user.gameData() })
// })

export default router