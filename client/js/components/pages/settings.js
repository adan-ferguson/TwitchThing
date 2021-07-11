import React from 'react'
import Page from '../page'
import TwitchLoginLink from '../twitchLoginLink'
import { post } from '../../fizzetch'

export default class Main extends Page {

  constructor(props){
    super(props)
    this.state = {
      settings: false
    }
  }

  render(){
    return <div className='settings'>{this._renderSettings()}</div>
  }

  _renderSettings(){

    if(!this.state.settings){
      return
    }

    if(!this.props.user.isAdmin){
      return <div>No settings LOL</div>
    }

    if(this.state.settings.channel.requiresAuth){
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
      loginLink: this.state.settings.channel.loginLink,
      stateID: this.state.settings.channel.stateID,
      text: 'Authorize with Twitch',
      redirectPage: 'Settings'
    })
  }

  async componentDidMount(){
    const settings = await post('/user/settings')
    this.setState({ settings })
    this.props.ready()
  }
}