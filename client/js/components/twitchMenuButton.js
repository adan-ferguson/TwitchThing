import React from 'react'
import PropTypes from 'prop-types'

export default class TwitchMenuButton extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object
    }
  }

  render(){
    return (
      <button className='twitch-menu-button twitch-button'>
        <i className='fab fa-twitch'/>
        {this.props.user.name}
        <i className='fas fa-caret-up'/>
      </button>
    )
  }
}