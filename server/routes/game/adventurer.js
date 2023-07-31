import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import { addRun } from '../../dungeons/dungeonRunner.js'
import db  from '../../db.js'
import Users from '../../collections/users.js'
import { requireRegisteredUser, validateParam } from '../../validations.js'
import DungeonRuns from '../../collections/dungeonRuns.js'
import { spendAdventurerOrb, spendAdventurerSkillPoint, spendStashedXp } from '../../adventurer/edit.js'
import { commitAdventurerLoadout } from '../../adventurer/loadout.js'
import Joi from 'joi'
import { fillArray } from '../../../game/utilFunctions.js'

const router = express.Router()
const verifiedRouter = express.Router()

router.post('/new', async(req, res) => {
  const name = validateParam(req.body.name)
  const adventurer = await Users.newAdventurer(req.user, name)
  res.send({ adventurerID: adventurer._id })
})

router.use('/:adventurerID', async (req, res, next) => {
  const adventurerID = db.id(req.params.adventurerID)
  req.adventurerDoc = await Adventurers.findByID(adventurerID)
  if(!req.adventurerDoc){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
  next()
})

router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', validateIdle, async(req, res) => {
  res.send({ adventurer: req.adventurerDoc })
})

verifiedRouter.post('/enterdungeon', validateIdle, async(req, res) => {
  requireOwnsAdventurer(req)
  const params = Joi.attempt(req.body, Joi.object({
    startingFloor: Joi.number().integer(),
    pace: Joi.string(),
    restThreshold: Joi.number().integer()
  }))
  const dungeonRun = await addRun(req.adventurerDoc._id, params)
  res.send({ dungeonRun })
  if(req.user.features.dungeonPicker === 1){
    req.user.features.dungeonPicker = 2
    Users.save(req.user)
  }
})

verifiedRouter.post('/edit', validateIdle, async (req, res) => {
  const user = await Users.gameData(req.user)
  res.status(200).send({
    adventurer: req.adventurerDoc,
    items: user.inventory.items
  })

  // Clear flags
  let updated = false
  if(user.features.editLoadout === 1){
    updated = true
    req.user.features.editLoadout = 2
  }
  if(user.features.spendPoints === 1){
    updated = true
    req.user.features.spendPoints = 2
  }
  if(updated){
    Users.save(req.user)
  }
})

verifiedRouter.post('/edit/spendorb', validateIdle, async(req, res) => {
  requireOwnsAdventurer(req)
  const className = validateParam(req.body.advClass, { type: 'string' })
  spendAdventurerOrb(req.adventurerDoc, req.user, className)
  await Adventurers.save(req.adventurerDoc)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('/edit/spendskillpoint', validateIdle, async(req, res) => {
  requireOwnsAdventurer(req)
  const skillId = validateParam(req.body.skillId, 'string')
  spendAdventurerSkillPoint(req.adventurerDoc, skillId)
  await Adventurers.save(req.adventurerDoc)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('/addxp', async(req, res) => {
  requireOwnsAdventurer(req)
  const xp = Joi.attempt(req.body.xp, Joi.number().integer())
  spendStashedXp(req.user, req.adventurerDoc, xp)
  await Adventurers.save(req.adventurerDoc)
  await Users.save(req.user)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('/edit/save', validateIdle, async (req, res) => {
  requireOwnsAdventurer(req)
  validateParam(req.body.items, 'array')
  validateParam(req.body.skills, 'array')
  await commitAdventurerLoadout(req.adventurerDoc, req.user, req.body.items, req.body.skills)
  await Adventurers.save(req.adventurerDoc)
  await Users.saveAndEmit(req.user)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('', async(req, res, next) => {
  res.send({ adventurer: req.adventurerDoc, user: req.user })
})

verifiedRouter.post('/dismiss', async(req, res, next) => {
  const index = req.user.adventurers.findIndex(advID => advID.equals(req.adventurerDoc._id))
  if(index === -1){
    throw 'Adventurer can not be dismissed, not in user\'s adventurer list'
  }
  req.user.adventurers.splice(index, 1)
  commitAdventurerLoadout(
    req.adventurerDoc,
    req.user,
    fillArray(() => null, 8),
    fillArray(() => null, 8)
  )
  req.user.inventory.stashedXp += Math.floor(req.adventurerDoc.xp / 2)
  await Users.save(req.user)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('/refund', async(req, res, next) => {
  const index = req.user.adventurers.findIndex(advID => advID.equals(req.adventurerDoc._id))
  if(index === -1){
    throw 'Adventurer can not be refunded, not in user\'s adventurer list'
  }
  req.adventurerDoc.xp /= 2
  req.adventurerDoc.unlockedSkills = {}
  req.adventurerDoc.orbs = {}
  commitAdventurerLoadout(
    req.adventurerDoc,
    req.user,
    fillArray(() => null, 8),
    fillArray(() => null, 8)
  )
  await Adventurers.save(req.adventurerDoc)
  await Users.save(req.user)
  res.status(200).send({ success: 1, adventurer: req.adventurerDoc })
})



verifiedRouter.post('/status', async(req, res, next) => {
  res.send({ status: req.adventurerDoc.dungeonRunID ? 'dungeon' : 'idle' })
})

verifiedRouter.post('/previousruns', async(req, res, next) => {
  const runs = await DungeonRuns.find({
    query: {
      'adventurer._id': req.adventurerDoc._id,
      finalized: { $ne: null }
    },
    projection: {
      events: 0
    }
  })
  res.send({ adventurer: req.adventurerDoc, runs: runs.reverse()  })
})

async function validateIdle(req, res, next){
  if(req.adventurerDoc.dungeonRunID){
    throw {
      status: 400,
      message: 'Adventurer is in a dungeon run and can not perform this action.',
      targetPage: '',
      output: false,
    }
  }
  next()
}

function requireOwnsAdventurer(req){
  requireRegisteredUser(req)
  if(!req.user.adventurers.find(adv => adv.equals(req.adventurerDoc._id))){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
}

export default router