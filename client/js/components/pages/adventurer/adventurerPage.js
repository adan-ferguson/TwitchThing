import Page from '../page.js'
import MainPage from '../main/mainPage.js'
import AdventurerStatsPage from '../adventurerStats/adventurerStatsPage.js'
import AdventurerLoadoutPage from '../adventurerLoadout/adventurerLoadoutPage.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

import '../../adventurer/statsBox.js'
import '../../loadout.js'

import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="flex-columns">
  <div class="flex-rows">
    <div class="content-well">
      <di-adventurer-statsbox></di-adventurer-statsbox>
    </div>
    <div class="content-well">
      <di-loadout></di-loadout>
    </div>
  </div>
  <div class="flex-rows dungeons">
      <div class="basic-dungeon content-well clickable">Enter Dungeon</div>
      <div class="something-else content-well">Something Else Goes Here</div>
  </div>
</div>
`

export default class AdventurerPage extends Page {

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
  }

  get backPage(){
    return () => new MainPage()
  }

  async load(){
    const result = await fizzetch(`/game/adventurer/${this.adventurerID}`)
    if(result.error){
      return result.error
    }else{
      // TODO: redirect to dungeon page if adventurer is in one
      this.adventurer = result.adventurer
      this._showStats()
      this._showLoadout()
      this._showDungeonButton()
    }
  }

  _showStats(){
    const stats = this.querySelector('di-adventurer-statsbox')
    stats.addEventListener('click', () => {
      // void this.app.setPage(new AdventurerStatsPage(this.adventurerID))
    })
    stats.setAdventurer(this.adventurer)
  }

  _showLoadout(){
    const loadout = this.querySelector('di-loadout')
    loadout.addEventListener('click', () => {
      // void this.app.setPage(new AdventurerLoadoutPage(this.adventurerID))
    })
    loadout.setAdventurer(this.adventurer)
  }

  _showDungeonButton(){
    this.querySelector('.basic-dungeon').addEventListener('click', () => {
      void this.app.setPage(new DungeonPickerPage(this.adventurerID))
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)