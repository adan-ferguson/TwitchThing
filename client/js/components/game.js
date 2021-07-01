import React from 'react'
import PropTypes from 'prop-types'
import User from '../user'
import TwitchMenuButton from './twitchMenuButton'
import { CSSTransition } from 'react-transition-group'

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
      <CSSTransition appear in={true} classNames='fade' timeout={500}>
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
      </CSSTransition>
    )
  }
}