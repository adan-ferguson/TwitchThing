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

    // this.moneyAmount = React.createRef()
    //
    // this.props.user.on('resources_updated', ({ diff }) => {
    //   if(diff.money){
    //     new FlyingTextEffect(this.moneyAmount.current, diff.money.change, {
    //       direction: 'up'
    //     })
    //   }
    //   this.forceUpdate()
    // })
  }

  get character(){
    return this.props.user.activeCharacter
  }

  render(){
    if(!this.character){
      return <div className='footer'/>
    }
    return (
      <div className='footer'>
        <div>{this.character.name}</div>
        <div>
          <div>Lvl: {this.character.level}</div>
          <div>Exp: {this.character.experience}</div>
        </div>
        <div>
          Items: {this.character.items}
        </div>
      </div>
    )
  }
}