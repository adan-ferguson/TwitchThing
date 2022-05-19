import { getRunData } from '../../dungeons/dungeonRunner.js'
import { finalizeResults, selectBonus } from '../../dungeons/results.js'
import express from 'express'
import db from '../../db.js'
import { validateParam } from '../../validations.js'

const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:dungeonRunID', async (req, res, next) => {
  req.dungeonRun = await getRunData(req.params.dungeonRunID)
  if(!req.dungeonRun){
    throw { code: 400, message: 'Invalid dungeon run ID' }
  }
  if(!req.dungeonRun.userID.equals(req.user._id)){
    throw { code: 400, message: 'Invalid dungeon run ID' }
  }
  next()
})

router.use('/:dungeonRunID', verifiedRouter)

verifiedRouter.post('/dungeonrun', async(req, res) => {
  res.send({
    dungeonRun: req.dungeonRun
  })
})

verifiedRouter.post('/results', async (req, res) => {
  if(!req.dungeonRun.results){
    throw { code: 400, message: 'Can not show results, dungeon run results not calculated yet.' }
  }
  res.send({
    dungeonRun: req.dungeonRun
  })
})

verifiedRouter.post('/selectbonus/:index', async (req, res) => {
  const nextLevelup = await selectBonus(req.dungeonRun, validateParam(req.params.index))
  res.status(200).send({ nextLevelup })
})

verifiedRouter.post('/finalizeresults', async (req, res) => {
  await finalizeResults(req.dungeonRun)
  res.status(200).send({ result: 'okay' })
})

export default router