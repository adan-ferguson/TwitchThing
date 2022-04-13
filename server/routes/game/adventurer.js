import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import DungeonRuns from '../../collections/dungeonRuns.js'
import { addRun } from '../../dungeons/dungeonRunner.js'
import { finalizeResults } from '../../dungeons/results.js'
import db  from '../../db.js'
import Users from '../../collections/users.js'
import { saveAdventurerLoadout } from '../../loadouts/adventurer.js'
const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:adventurerID', function(req, res, next){
  req.adventurerID = db.id(req.params.adventurerID)
  if(!req.user.adventurers.find(adv => adv.equals(req.adventurerID))){
    return res.status(401).send('Not logged in')
  }
  next()
})

// TODO is this really the only way to do this
router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', async(req, res) => {
  try {
    res.send({ dungeons: ['these do not exist yet lol'] })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

verifiedRouter.post('/enterdungeon/:dungeonID', async(req, res) => {
  try {
    const dungeonRun = addRun(req.adventurerID, req.params.dungeonID)
    res.send({ dungeonRun })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/dungeonrun', async(req, res) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    if(!adventurer.dungeonRunID){
      return res.status(404).send({ error: 'Adventurer is not currently in a dungeons run.' })
    }
    const dungeonRun = await DungeonRuns.findOne({
      _id: adventurer.dungeonRunID,
      adventurerID: req.adventurerID
    })
    if(!dungeonRun){
      return res.status(500).send({ error: 'Could not load dungeons run.' })
    }
    res.send({ adventurer, dungeonRun })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/results', async (req, res) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    if(!adventurer.dungeonRunID){
      return res.status(401).send({ error: 'Adventurer is not currently in a dungeons run.', targetPage: 'Adventurer' })
    }
    const dungeonRun = await DungeonRuns.findOne(adventurer.dungeonRunID)
    if(!dungeonRun || !dungeonRun.finished){
      return res.status(401).send({ error: 'Dungeon run is not finished yet.', targetPage: 'Dungeon' })
    }
    res.send({
      adventurer,
      dungeonRun
    })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/confirmresults', async (req, res) => {
  try {
    req.validateParam('selectedBonuses')
    await finalizeResults(req.adventurerID, req.body.selectedBonuses)
    res.status(200).send({ result: 'okay' })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/editloadout', async (req, res) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    const user = await Users.gameData(req.user)
    res.status(200).send({ adventurer, items: user.inventory.items })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/editloadout/save', async (req, res) => {
  try {
    const items = req.validateParam('items', { type: 'array' })
    const adventurer = await Adventurers.findOne(req.adventurerID)
    await saveAdventurerLoadout(adventurer, req.user, items)
    res.status(200).end()
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('', async(req, res, next) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    if(adventurer.dungeonRunID){
      return res.status(401).send({ error: 'Adventurer is currently in a dungeons run.', targetPage: 'Dungeon' })
    }
    res.send({ adventurer })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router