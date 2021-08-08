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
    const items = this.props.character.items.slice()
    items.forEach(i => {
      if(i){
        i.locked = true
      }
    })
    this.state = { items }
  }

  render(){
    return (
      <div className='character-inventory'>
        <div className='inv-header'>
          <div className='character-name'>{this.props.character.name}</div>
          <div className='character-points'>
            {this._calcPoints()}/{this.props.character.level}
          </div>
        </div>
        <div className='item-list'>
          {this.state.items.map((item, i) => <InventoryItem item={item} key={item ? item.uuid : 'slot' + i}/>)}
        </div>
      </div>
    )
  }

  _calcPoints(){
    return this.state.items.reduce((item, val) => val + item ? item.level : 0, 0)
  }
}