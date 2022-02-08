import express from 'express'
import * as Users from '../collections/users.js'
import * as Adventurers from '../collections/adventurers.js'
import * as Combats from '../collections/combats.js'

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
  let redirect = ''
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

router.use('/adventurer', adventurerRouter)

router.post('/main', async(req, res) => {
  try {
    const payload = await Users.loadData(req.user, {
      adventurers: {
        name: 1,
        level: 1,
        currentVenture: 1
      }
    })
    res.send(payload)
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
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

router.post('/combat/:combatID', async(req, res) => {
  try {
    const combat = Combats.findOne(req.combatID)
    if(!combat){
      return res.status(404).send('Combat not found.')
    }
    const currentTime = new Date() - combat.startTime
    return { combat, currentTime }
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

router.get('/', async(req, res) => {
  res.render('game')
})

export default router