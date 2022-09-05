import express from 'express'
import config from '../config.js'
import { getRunData } from '../dungeons/dungeonRunner.js'
import db from '../db.js'

const router = express.Router()

router.get('/oauthredirect', (req, res) => {
  res.render('oauthredirect', {
    magicPublishableKey: config.magic.publishableKey
  })
})

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/game')
  }else{
    res.render('login', {
      magicPublishableKey: config.magic.publishableKey
    })
  }
})

router.get('/', (req, res) => {
  if(!req.user){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

/**************************************/

router.post('/dungeonrun/:dungeonRunID', async (req, res) => {
  const dungeonRun = await getRunData(db.id(req.params.dungeonRunID))
  if(!dungeonRun){
    return res.status(400).send({ error: 'Dungeon Run not found' })
  }
  res.send({
    dungeonRun
  })
})

export default router