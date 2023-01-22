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

router.get('/dungeonrun/:dungeonRunID', async (req, res) => {
  res.redirect('/game/dungeonrun/' + req.params.dungeonRunID)
})

export default router