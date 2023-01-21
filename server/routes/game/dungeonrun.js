import { getRunData } from '../../dungeons/dungeonRunner.js'
import { finalize } from '../../dungeons/results.js'
import express from 'express'

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
  res.send({ dungeonRun: req.dungeonRun })
})

verifiedRouter.post('/finalize', async (req, res, next) => {
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

export default router