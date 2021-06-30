import React from 'react'

let userJson

export async function loadUser(){
  const response = await fetch('/gettwitchuser', {
    method: 'POST'
  })
  userJson = await response.json()
  return userJson.user || false
}

export class TwitchLoginLink extends React.Component {
  render(){
    if(userJson.loginLink && userJson.stateID) {
      return <a href={userJson.loginLink} onClick={loginClicked}>Log In with Twitch</a>
    }else {
      return <p>An error occurred. (LOL)</p>
    }
  }
}

function loginClicked(){
  localStorage.stateID = userJson.stateID
  localStorage.redirectTarget = window.location.pathname
}