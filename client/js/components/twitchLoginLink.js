import React from 'react'
import PropTypes from 'prop-types'

export default class TwitchLoginLink extends React.Component {

  static get propTypes(){
    return {
      loginLink: PropTypes.string,
      stateID: PropTypes.string
    }
  }

  render(){
    if(this.props.loginLink && this.props.stateID) {
      return <a href={this.props.loginLink} onClick={loginClicked}>Log In with Twitch</a>
    }else {
      return <p>An error occurred. (LOL)</p>
    }
  }
}

function loginClicked(){
  localStorage.stateID = this.props.stateID
  localStorage.redirectTarget = window.location.pathname
}