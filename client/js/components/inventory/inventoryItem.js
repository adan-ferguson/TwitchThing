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
    return <div className='item-slot'>{this.contents()}</div>
  }

  contents(){
    if(this.props.item instanceof Item){
      return <div className='item' data-locked={this.props.item.locked}>{this.props.item.itemDefinition.name}</div>
    }
    return <div className='empty'/>
  }
}