import React from 'react'
import PropTypes from 'prop-types'
import User from '../user.js'

import CharacterInfo from './pages/characterInfo.js'
import Inventory from './pages/inventory.js'
import Battle from './pages/battle.js'

export default class Footer extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.instanceOf(User).isRequired,
      changePage: PropTypes.func.isRequired
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
      return <div className='footer-hidden'/>
    }
    return (
      <div className='footer'>
        <button onClick={() => this.props.changePage(CharacterInfo)}>Lvl. {this.character.level} {this.character.name}</button>
        <button onClick={() => this.props.changePage(Battle)}>Battle</button>
        <button onClick={() => this.props.changePage(Inventory)}>Items: ???</button>
      </div>
    )
  }
}