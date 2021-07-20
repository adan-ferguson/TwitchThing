import React from 'react'
import PropTypes from 'prop-types'

import TwitchMenuButton from './twitchMenuButton.js'
import User from '../user.js'

import Shop from './pages/shop.js'
import Messages from './pages/messages.js'

export default class Header extends React.Component {

  static get propTypes(){
    return {
      changePage: PropTypes.func.isRequired,
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  render(){
    return (
      <div className='header'>
        <button onClick={() => this.props.changePage(Shop)}>Money: {this.props.user.resources.money}</button>
        <button onClick={() => this.props.changePage(Messages)}>Messages</button>
        {React.createElement(TwitchMenuButton, {
          user: this.props.user,
          changePage: this.props.changePage
        })}
      </div>
    )
  }
}