import express from 'express'
import * as Users from '../collections/users.js'
import * as Adventurers from '../collections/adventurers.js'

import pagedataRouter from './game/pagedata.js'
import adventurerRouter from './game/adventurer.js'

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

router.use('/pagedata', pagedataRouter)
router.use('/adventurer', adventurerRouter)

router.get('/', async(req, res) => {
  res.render('game', { user: await Users.loadGameData(req.user) })
})

router.post('/newadventurer', async(req, res) => {
  try {
    req.validateParamExists('name')
    const adventurer = await Users.newAdventurer(req.user, req.body.name)
    res.send(adventurer)
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})


export default router