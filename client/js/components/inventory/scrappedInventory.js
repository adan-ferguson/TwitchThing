import React from 'react'
import InventoryItem from './inventoryItem.js'

export default class ScrappedInventory extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      items: []
    }
  }

  render(){
    return (
      <div className='scrapped-inventory'>
        <div className='inv-header'>
          Will be scrapped: {this._totalScrap()}
        </div>
        <div className='item-list'>
          {this.state.items.map(item => <InventoryItem item={item} key={item.uuid}/>)}
        </div>
      </div>
    )
  }

  _totalScrap(){
    return this.state.items.reduce((item, total) => total + item.scrapValue(), 0)
  }
}