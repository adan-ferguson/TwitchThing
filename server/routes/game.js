import express from 'express'
import log from 'fancy-log'

import * as Users from '../collections/users.js'

const router = express.Router()

// Make sure we're logged in.
router.use(async (req, res, next) => {
  if(!req.user){
    if(req.method === 'GET'){
      return res.redirect('/')
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

// Make sure we're allowed to play, and if not then redirect somewhere.
router.use((req, res, next) => {
  let redirect = false
  if(!Users.isSetupComplete(req.user)){
    redirect = '/user/newuser'
  }
  if(redirect){
    if(req.method === 'GET'){
      return res.redirect(redirect)
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

router.get('/', async(req, res) => {
  res.render('game', { user: await Users.loadGameData(req.user) })
})

router.post('/load', async(req, res) => {
  if(!req.body){
    return res.status(401).send('Missing body data')
  }
  try {
    const payload = await Users.loadData(req.user._id, req.body.category)
    res.send(payload)
  }catch(ex){
    return res.status(401).send(ex)
  }
})

// router.post('/makecharacter', async(req, res) => {
//   try {
//     const character = await createCharacter(req.user, req.body.name)
//     res.send(character)
//   }catch(errors){
//     return res.status(400).send({ errors })
//   }
// })

export default router