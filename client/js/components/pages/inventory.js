import React from 'react'
import Page from '../page.js'

import UserInventory from '../inventory/userInventory.js'
import CharacterInventory from '../inventory/characterInventory.js'
import ScrappedInventory from '../inventory/scrappedInventory.js'

export default class Inventory extends Page {

  constructor(props){
    super(props)
    this.userInventory = React.createRef()
    this.characterInventory = React.createRef()
    this.scrappedInventory = React.createRef()
  }

  render(){
    return (
      <div id='inventory'>
        <h1>Swap Gear</h1>
        <UserInventory ref={this.userInventory} user={this.props.user}/>
        <CharacterInventory ref={this.characterInventory} character={this.props.user.activeCharacter}/>
        <ScrappedInventory ref={this.scrappedInventory}/>
      </div>
    )
  }
}