import React from 'react'
import PropTypes from 'prop-types'

import { Item } from '/game/item'

export default class InventoryItem extends React.Component {

  static get propTypes(){
    return {
      item: PropTypes.instanceOf(Item).isRequired
    }
  }

  render(){
    return <div>{this.props.item.itemDefinition.name}</div>
  }

}