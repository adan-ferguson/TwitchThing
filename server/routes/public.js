import express from 'express'
import config from '../config.js'

const router = express.Router()

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
  console.log('login', req.user, req.session, req.sessionID)
  if(!req.user){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

export default router