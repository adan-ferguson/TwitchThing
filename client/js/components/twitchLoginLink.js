import React from 'react'
import PropTypes from 'prop-types'

export default class TwitchLoginLink extends React.Component {

  static get propTypes(){
    return {
      loginLink: PropTypes.string.isRequired,
      stateID: PropTypes.string.isRequired,
      text: PropTypes.string,
      redirectPage: PropTypes.string
    }
  }

  render(){
    if(this.props.loginLink && this.props.stateID) {
      return (
        <a id='login-link' className='twitch-button' href={this.props.loginLink} onClick={this.loginClicked.bind(this)} rel="noreferrer">
          <i className='fab fa-twitch'/> {this.props.text || 'Log In with Twitch'}
        </a>
      )
    }else {
      return <p>An error occurred. (LOL)</p>
    }
  }

  loginClicked(){
    localStorage.stateID = this.props.stateID
    localStorage.redirectPage = this.props.redirectPage
  }
}