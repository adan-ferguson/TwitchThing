import React from 'react'
import PropTypes from 'prop-types'
import TwitchMenuButton from './twitchMenuButton'
import User from '../user'
import FlyingTextEffect from '../misc/flyingTextEffect'

export default class Footer extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  constructor(props){
    super(props)

    this.moneyAmount = React.createRef()

    this.state = {
      user: props.user
    }

    this.state.user.on('updated', ({ diff }) => {
      if(diff.money){
        new FlyingTextEffect(this.moneyAmount.current, diff.money.change, {
          direction: 'up'
        })
      }
      this.forceUpdate()
    })
  }

  render(){
    return (
      <div className='footer'>
        <p>Exp: {this.state.user.data.exp}</p>
        <p ref={this.moneyAmount}>Money: {this.state.user.data.money}</p>
        {React.createElement(TwitchMenuButton, { user: this.state.user })}
      </div>
    )
  }
}