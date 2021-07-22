import React from 'react'
import PropTypes from 'prop-types'

import Character from '/game/character.js'

export default class CharacterInventory extends React.Component {

  static get propTypes() {
    return {
      character: PropTypes.instanceOf(Character).isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      inventory: this.props.character.inventory.clone()
    }
  }

  render(){
    if(!this.state.inventory){
      return null
    }
    return (
      <div className='character-inventory'>
        {this.state.inventory}
      </div>
    )
  }
}