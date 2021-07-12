import React from 'react'
import PropTypes from 'prop-types'
import Channel from '../channel'
import TwitchLoginLink from './twitchLoginLink'

export default class ChannelSettings extends React.Component {

  static get propTypes(){
    return {
      channelSettings: PropTypes.object
    }
  }

  constructor(props){
    super(props)
    if(props.channelSettings.authRequired){
      this.state = {
        authRequired: props.channelSettings.authRequired
      }
    }else{
      this.state = {
        channel: new Channel(props.channelSettings.channelDocument)
      }
    }
  }

  render(){

    if(this.state.authRequired){
      return (
        <div>
          <p>
            Write diatribe here LOL
          </p>
          {_authLink(this.state.authRequired)}
        </div>
      )
    }

    return (
      <div>
        <p>
          Twitch authorization successful <i className='fas fa-check'/>
        </p>
        <label>
          Enabled
          <input type='checkbox' checked={this.state.channel.doc.enabled} onChange={e => {
            const checked = e.target.checked
            this.state.channel.setEnabled(checked)
            this.forceUpdate()
          }}/>
        </label>
      </div>
    )
  }
}

function _authLink(auth){
  return React.createElement(TwitchLoginLink, {
    loginLink: auth.loginLink,
    stateID: auth.stateID,
    text: 'Authorize with Twitch',
    redirectPage: 'Settings'
  })
}