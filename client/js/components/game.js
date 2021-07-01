import React from 'react'
import PropTypes from 'prop-types'
import User from '../user'
import TwitchMenuButton from './twitchMenuButton'

export default class Game extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object
    }
  }

  constructor(props){
    super(props)
    this.user = new User(props.user)
  }

  render(){
    return (
      <div className='game'>
        <div className='main'>
          <p>No gameplay exists at the moment.</p>
        </div>
        <div className='footer'>
          <p>Exp: {this.user.exp}</p>
          <p>Money: {this.user.money}</p>
          {React.createElement(TwitchMenuButton, { user: this.user })}
        </div>
      </div>
    )
  }
}