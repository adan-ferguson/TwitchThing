import React from 'react'
import { post } from './fizzetch.js'
import TwitchLoginLink from './components/twitchLoginLink.js'
import User from './user.js'
import { setupUser } from './socketClient.js'

let userJson

export async function loadUser(){
  userJson = await post('/gettwitchuser', {
    accessToken: localStorage.getItem('accessToken')
  })
  if(userJson.user){
    const user = new User(userJson.user)
    setupUser(user)
    return user
  }
  return false
}

export function createLoginLink(){
  return React.createElement(TwitchLoginLink, {
    loginLink: userJson.loginLink,
    stateID: userJson.stateID
  })
}