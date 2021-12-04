import React from 'react'
import PropTypes from 'prop-types'

import InventoryItem from './inventoryItem.js'
import User from '../../bridges/user.js'

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
        <div className='inv-header'>
          <div>Your Items</div>
          <button>Filter</button>
        </div>
        <div className='item-list'>
          {this.state.inventory.map((item, i) => <InventoryItem item={item} key={item ? item.uuid : 'slot' + i}/>)}
        </div>
      </div>
    )
  }
}