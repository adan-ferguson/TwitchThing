import express from 'express'
import config from '../config.js'
import { getRunData } from '../dungeons/dungeonRunner.js'
import db from '../db.js'
import Adventurers from '../collections/adventurers.js'

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

export default router