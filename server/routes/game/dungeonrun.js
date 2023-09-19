import { getActiveRun, getRunData } from '../../dungeons/dungeonRunner.js'
import { finalize } from '../../dungeons/results.js'
import express from 'express'
import Combats from '../../collections/combats.js'
import { arrayToObject, removeNaNs } from '../../../game/utilFunctions.js'
import { requireRegisteredUser } from '../../validations.js'
import FullEvents from '../../collections/fullEvents.js'
import { compress } from 'compress-json'

const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:dungeonRunID', async (req, res, next) => {
  if(req.method === 'GET'){
    return next()
  }
  req.dungeonRun = await getRunData(req.params.dungeonRunID)
  if(!req.dungeonRun){
    throw { code: 400, message: 'Invalid dungeon run ID' }
  }
  next()
})

router.use('/:dungeonRunID', verifiedRouter)

verifiedRouter.post('/', async (req, res, next) => {
  const ret = { dungeonRun: req.dungeonRun }
  res.send(ret)
})

verifiedRouter.post('/loadfull', async (req, res, next) => {
  let events = (await FullEvents.findByDungeonRunID(req.dungeonRun._id)).map(e => e.data)
  const combatIds = events.filter(e => e.roomType === 'combat').map(e => e.combatID)
  let combats = arrayToObject(await Combats.findByIDs(combatIds), '_id')

  const compressed = true
  if(compressed){
    events.filter(e => e.combatID).forEach(e => e.combatID = e.combatID.toString())
    events = compress(removeNaNs(events))
    combats = compress(removeNaNs(combats))
  }

  res.send({ combats, events, compressed })
})

verifiedRouter.post('/finalize', async (req, res, next) => {
  requireOwnsAdventurer(req)
  if(!req.dungeonRun.finished){
    throw { code: 400, message: 'Can not show results, dungeon run is not finished yet.' }
  }
  if(!req.dungeonRun.adventurer.userID.equals(req.user?._id)){
    throw { code: 400, message: 'Invalid dungeon run ID' }
  }
  if(!req.dungeonRun.finalized){
    await finalize(req.dungeonRun)
  }
  res.status(200).send({})
})

verifiedRouter.post('/instruct', async(req, res, next) => {
  requireOwnsAdventurer(req)
  getActiveRun(req.dungeonRun._id)?.updateInstructions(req.body)
  res.status(200).send({})
})

function requireOwnsAdventurer(req){
  requireRegisteredUser(req)
  if(!req.user.adventurers.find(adv => adv.equals(req.dungeonRun.adventurer._id))){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
}

export default router