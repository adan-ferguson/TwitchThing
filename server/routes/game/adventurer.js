import express from 'express'
import * as Adventurers from '../../collections/adventurers.js'
import db from '../../db.js'
const router = express.Router()
const router2 = express.Router()

router.use('/:adventurerID', function(req, res, next){
  req.adventurerID = db.id(req.params.adventurerID)
  if(!req.user.adventurers.find(adv => adv.equals(req.adventurerID))){
    return res.status(401).send('Not logged in')
  }
  next()
})

router.use('/:adventurerID', router2)

router2.post('/dungeonpicker', async(req, res) => {
  try {
    res.send({ dungeons: ['these do not exist yet lol'] })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

router2.post('/enterdungeon/:dungeonID', async(req, res) => {
  try {
    const result = await Adventurers.enterDungeon(req.adventurerID, req.params.dungeonID)
    res.send({ result })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

router2.post('*', async(req, res, next) => {
  try {
    const adventurer = await Adventurers.loadData(req.adventurerID, {
      name: 1,
      level: 1,
      xp: 1,
      loadout: 1
    })
    res.send({ adventurer })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router