import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import { addRun } from '../../dungeons/dungeonRunner.js'
import db  from '../../db.js'
import Users from '../../collections/users.js'
import { commitAdventurerLoadout } from '../../loadouts/adventurer.js'
import { validateParam } from '../../validations.js'
import { selectBonus } from '../../adventurer/bonuses.js'

const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:adventurerID', async (req, res, next) => {
  const adventurerID = db.id(req.params.adventurerID)
  if(!req.user.adventurers.find(adv => adv.equals(adventurerID))){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
  req.adventurer = await Adventurers.findOne(adventurerID)
  if(!req.adventurer){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
  next()
})

router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', validateIdle, async(req, res) => {
  res.send({ adventurer: req.adventurer })
})

verifiedRouter.post('/enterdungeon', validateIdle, async(req, res) => {
  const startingZone = validateParam(req.body.startingZone, { type: 'integer' })
  const dungeonRun = await addRun(req.adventurer._id, {
    startingZone
  })
  res.send({ dungeonRun })
})

verifiedRouter.post('/editloadout', validateIdle, async (req, res) => {
  const user = await Users.gameData(req.user)
  res.status(200).send({
    adventurer: req.adventurer,
    items: user.inventory.items
  })

  // Clear the new feature + items
  let updated = false
  if(user.features.items === 1){
    updated = true
    req.user.features.items = 2
  }
  Object.values(req.user.inventory.items).forEach(item => {
    if(item.isNew){
      item.isNew = false
      updated = true
    }
  })
  if(updated){
    Users.save(req.user)
  }
})

verifiedRouter.post('/editloadout/save', validateIdle, async (req, res) => {
  const items = validateParam(req.items, { type: 'array' })
  await commitAdventurerLoadout(req.adventurer, req.user, items)
  await Adventurers.save(req.adventurer)
  await Users.save(req.user)
  res.status(200).end()
})

verifiedRouter.post('', async(req, res, next) => {
  res.send({ adventurer: req.adventurer })
})

verifiedRouter.post('/status', async(req, res, next) => {
  res.send({ status: req.adventurer.dungeonRunID ? 'dungeon' : 'idle' })
})

verifiedRouter.post('/selectbonus/:index', async(req, res, next) => {
  const index = validateParam(req.params.index, {
    type: 'integer',
    validationFn: val => val >= 0 && val <= 2
  })
  res.send({ nextLevelUp: await selectBonus(req.adventurer, index) })
})

async function validateIdle(req, res, next){
  if(req.adventurer.dungeonRunID){
    throw {
      status: 400,
      message: 'Adventurer is in a dungeon run and can not perform this action.'
    }
  }
  next()
}

export default router