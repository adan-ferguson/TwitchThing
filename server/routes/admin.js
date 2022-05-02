import express from 'express'
import Users from '../collections/users.js'
import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Combats from '../collections/combats.js'
import { cancelAllRuns } from '../dungeons/dungeonRunner.js'

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
  res.status(200).end()
})

router.post('/runcommand', async(req, res) => {
  req.validateParam('command')
  const cmd = req.body.command
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

export default router