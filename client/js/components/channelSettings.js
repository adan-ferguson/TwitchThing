import React from 'react'
import PropTypes from 'prop-types'
import Channel from '../channel'
import TwitchLoginLink from './twitchLoginLink'

export default class ChannelSettings extends React.Component {

  static get propTypes(){
    return {
      channel: PropTypes.instanceOf(Channel).isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      enabled: this.props.channel.doc.enabled
    }
  }

  render(){

    if(this.props.channel.requiresAuth){
      return (
        <div>
          <p>
            Write diatribe here LOL
          </p>
          {_authLink(this.props.channel)}
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
          <input type='checkbox' checked={this.state.enabled} onChange={e => {
            const checked = e.target.checked
            this.props.channel.setEnabled(checked)
            this.setState({
              enabled: checked
            })
          }}/>
        </label>
      </div>
    )
  }
}

function _authLink(channel){
  return React.createElement(TwitchLoginLink, {
    loginLink: channel.loginLink,
    stateID: channel.stateID,
    text: 'Authorize with Twitch',
    redirectPage: 'Settings'
  })
}