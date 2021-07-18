import React from 'react'
import PropTypes from 'prop-types'
import User from '../user.js'
import FlyingTextEffect from '../misc/flyingTextEffect.js'

export default class Footer extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  constructor(props){
    super(props)

    this.moneyAmount = React.createRef()

    this.props.user.on('resources_updated', ({ diff }) => {
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
        <div ref={this.moneyAmount}>Money: {this.props.user.resources.money}</div>
      </div>
    )
  }
}