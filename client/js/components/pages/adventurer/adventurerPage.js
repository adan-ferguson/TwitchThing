import Page from '../page.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

import fizzetch from '../../../fizzetch.js'
import AdventurerLoadoutPage from '../adventurerLoadout/adventurerLoadoutPage.js'

import '../../adventurerPane.js'
import { pageFromString } from '../../app.js'

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

  get titleText(){
    return this.adventurer.name
  }

  async load(){

    const { adventurer, ctas, error, targetPage } = await fizzetch(`/game/adventurer/${this.adventurerID}`)
    if(targetPage){
      return this.redirectTo(pageFromString({ name: targetPage.name, args: targetPage.args }))
    }
    if(error){
      return error
    }

    this.adventurer = adventurer
    this.adventurerPane.setAdventurer(adventurer)

    this._setupEditEquipmentButton(ctas?.itemFeature)
    this._showDungeonButton()
  }

  _setupEditEquipmentButton(itemFeatureIsNew = false){

    const btn = this.querySelector('button.edit')
    if(!this.user.features.items){
      btn.classList.add('displaynone')
      return
    }else if(itemFeatureIsNew){
      btn.classList.add('glow')
    }

    btn.addEventListener('click', () => {
      this.redirectTo(new AdventurerLoadoutPage(this.adventurerID))
    })

  }

  _showDungeonButton(){
    this.querySelector('.basic-dungeon').addEventListener('click', () => {
      this.redirectTo(new DungeonPickerPage(this.adventurerID))
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)