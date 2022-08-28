import express from 'express'
import Users from '../collections/users.js'
import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Combats from '../collections/combats.js'
import { cancelAllRuns, getActiveRunData } from '../dungeons/dungeonRunner.js'
import { validateParam } from '../validations.js'
import { getErrorLogTail, getOutputLogTail } from '../logging.js'
import FighterInstance from '../../game/combat/fighterInstance.js'
import { generateCombat } from '../combat/combat.js'

const router = express.Router()

// Make sure we're logged in + we're an admin
router.use(async (req, res, next) => {
  if(!Users.isAdmin(req.user)){
    if(req.method === 'GET'){
      return res.redirect('/')
    }else{
      return res.status(401).send({ error: 'Unauthorized' })
    }
  }
  next()
})

router.post('/', async(req, res) => {
  res.status(200).send({})
})

router.post('/adventurers', async(req, res) => {
  const adventurers = await Adventurers.find()
  adventurers.forEach(adv => adv.dungeonRun = getActiveRunData(adv.dungeonRunID))
  res.status(200).send({ adventurers })
})


router.post('/logs', async(req, res) => {
  const outputlog = await getOutputLogTail()
  const errorlog = await getErrorLogTail()
  res.status(200).send({ outputlog, errorlog })
})

router.post('/runcommand', async(req, res) => {
  const cmd = validateParam(req.body.command)
  let result = 'Command not found'
  if(cmd === 'reset all'){
    cancelAllRuns()
    await Promise.all([
      Users.resetAll(),
      Adventurers.removeAll(),
      DungeonRuns.removeAll(),
      Combats.removeAll()
    ])
    result = 'Everything has been successfully reset.'
  }
  res.status(200).send({ result })
})

router.post('/sim', async (req, res) => {
  const adventurers = await Adventurers.collection.find({ sort: { level: -1 } })
  res.status(200).send({ adventurers })
})

router.post('/sim/run', async (req, res) => {
  const adv1 = validateParam(req.body.fighter1)
  const adv2 = validateParam(req.body.fighter2)
  const fighter1 = new FighterInstance(await Adventurers.findByID(adv1), {}, 1)
  const fighter2 = new FighterInstance(await Adventurers.findByID(adv2), {}, 2)
  const combat = await generateCombat(fighter1, fighter2)
  res.status(200).send({ combatID: combat._id })
})

export default router