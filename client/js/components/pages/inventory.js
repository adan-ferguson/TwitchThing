import React from 'react'
import Page from '../page.js'
import Character from '../../character.js'

import UserInventory from '../inventory/userInventory.js'
import CharacterInventory from '../inventory/characterInventory.js'
import CharacterStats from '../inventory/characterStats.js'
import ScrappedInventory from '../inventory/scrappedInventory.js'

export default class Inventory extends Page {

  constructor(props){
    super(props)
    this.userInventory = React.createRef()
    this.characterInventory = React.createRef()
    this.scrappedInventory = React.createRef()

    const cloneCharacter = new Character(this.props.user.activeCharacter.data)
    cloneCharacter.filteredItems.forEach(i => i.locked = true)
    this.state = { cloneCharacter: cloneCharacter }
  }

  render(){
    return (
      <div id='inventory'>
        <h1>Swap Gear</h1>
        <div className='panels'>
          <UserInventory ref={this.userInventory} user={this.props.user}/>
          <CharacterInventory ref={this.characterInventory} character={this.state.cloneCharacter}/>
          <div className='right-panel'>
            <CharacterStats character={this.state.cloneCharacter}/>
            <ScrappedInventory ref={this.scrappedInventory}/>
          </div>
        </div>
      </div>
    )
  }
}