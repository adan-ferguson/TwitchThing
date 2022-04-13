import Page from '../page.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

import fizzetch from '../../../fizzetch.js'
import AdventurerLoadoutPage from '../adventurerLoadout/adventurerLoadoutPage.js'

import './adventurerPane.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <di-adventurer-pane></di-adventurer-pane>
    <button class="edit content-no-grow">Edit Equipment</button>
  </div>
  <div class="content-rows dungeons">
      <div class="basic-dungeon content-well clickable">Enter Dungeon</div>
      <div class="something-else content-well">Something Else Goes Here</div>
  </div>
</div>
`

export default class AdventurerPage extends Page{

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.adventurerPane = this.querySelector('di-adventurer-pane')
  }

  async load(){

    const { adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}`)
    if(error){
      return { error }
    }

    this.adventurerPane.setAdventurer(adventurer)
    this.querySelector('button.edit').addEventListener('click', () => {
      this.app.setPage(new AdventurerLoadoutPage(this.adventurerID))
    })

    this._showDungeonButton()
  }

  _showDungeonButton(){
    this.querySelector('.basic-dungeon').addEventListener('click', () => {
      void this.app.setPage(new DungeonPickerPage(this.adventurerID))
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)