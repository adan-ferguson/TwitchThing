import express from 'express'
import * as Users  from '../collections/users.js'
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

router.get('/newuser', async (req, res) => {

  if(!req.user){
    return res.redirect('/login')
  }

  if(req.user.displayname){
    return res.redirect('/game')
  }

  let err = ''
  if(req.query && req.query.displayname){
    err = await Users.setDisplayname(req.user, req.query.displayname)
    if(!err) {
      return res.redirect('/game')
    }
  }
  res.render('newuser', { error: err })
})

router.get('/', (req, res) => {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

export default router