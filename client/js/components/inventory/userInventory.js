import React from 'react'
import PropTypes from 'prop-types'

import InventoryItem from './inventoryItem.js'
import User from '../../user.js'

export default class UserInventory extends React.Component {

  static get propTypes() {
    return {
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      inventory: this.props.user.inventory.slice()
    }
  }

  render(){
    return (
      <div className='user-inventory'>
        <div>Some sort of filtering</div>
        <div className='item-list'>
          {this.state.inventory.map(item => <InventoryItem item={item} key={item.uuid}/>)}
        </div>
      </div>
    )
  }
}