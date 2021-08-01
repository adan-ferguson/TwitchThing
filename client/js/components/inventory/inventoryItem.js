import React from 'react'
import PropTypes from 'prop-types'

import Item from '/game/item.js'

export default class InventoryItem extends React.Component {

  static get propTypes(){
    return {
      item: PropTypes.any
    }
  }

  render(){
    return <div className='inventory-item'>{this.contents()}</div>
  }

  contents(){
    if(this.props.item instanceof Item){
      return <div>{this.props.item.itemDefinition.name}</div>
    }
    return null
  }

}