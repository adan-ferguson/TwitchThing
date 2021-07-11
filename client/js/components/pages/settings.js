import React from 'react'
import Page from '../page'
import TwitchLoginLink from '../twitchLoginLink'

export default class Main extends Page {

  constructor(props){
    super(props)
    this.state = {
      settingsInfo: false
    }
  }

  render(){
    return <div className='settings'>{this.settingsInfo ? 'Loading...' : this._settings()}</div>
  }

  _settings(){

    if(!this.user.isAdmin){
      return <div>No settings LOL</div>
    }

    if(this.state.settingsInfo.requiresAuth){
      return (
        <div>
          <p>
            Write diatribe here LOL
          </p>
          {this._authLink()}
        </div>
      )
    }

    return (
      <div>
        Channel is registered
      </div>
    )
  }

  _authLink(){
    return React.createElement(TwitchLoginLink, {
      loginLink: this.state.settingsInfo.loginLink,
      stateID: this.state.settingsInfo.stateID,
      text: 'Authorize with Twitch',
      targetPage: 'Settings'
    })
  }
}