import React from 'react'
import PropTypes from 'prop-types'
import TwitchButton from './twitchButton'

export default class TwitchLoginLink extends React.Component {

  static get propTypes(){
    return {
      loginLink: PropTypes.string,
      stateID: PropTypes.string
    }
  }

  render(){
    if(this.props.loginLink && this.props.stateID) {
      return <TwitchButton isAnchor={true} href={this.props.loginLink} onClick={loginClicked}>Log In with Twitch</TwitchButton>
    }else {
      return <p>An error occurred. (LOL)</p>
    }
  }
}

function loginClicked(){
  localStorage.stateID = this.props.stateID
  localStorage.redirectTarget = window.location.pathname
}