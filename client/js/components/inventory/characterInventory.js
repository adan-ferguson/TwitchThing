import React from 'react'
import PropTypes from 'prop-types'

import Character from '/client/js/character.js'
import InventoryItem from './inventoryItem.js'

export default class CharacterInventory extends React.Component {

  static get propTypes() {
    return {
      character: PropTypes.instanceOf(Character).isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      inventory: this.props.character.items.slice()
    }
  }

  render(){
    if(!this.state.inventory){
      return null
    }
    return (
      <div className='character-inventory'>
        <div className='item-list'>
          {this.state.inventory.map((item, i) => <InventoryItem item={item} key={item ? item.uuid : 'slot' + i}/>)}
        </div>
      </div>
    )
  }
}