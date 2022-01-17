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
  <di-adventurer-well></di-adventurer-well>
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
    this.adventurerWell = this.querySelector('di-adventurer-well')
  }

  get backPage(){
    return () => new MainPage()
  }

  async load(){
    const result = await fizzetch(`/game/adventurer/${this.adventurerID}`)
    if(result.error){
      return result.error
    }else{
      this.adventurer = result.adventurer
      this.adventurerWell.setAdventurer(this.adventurer)
      // this.adventurerWell.statsbox.classList.add('clickable')
      this.adventurerWell.statsbox.addEventListener('click', () => {
        // void this.app.setPage(new AdventurerStatsPage(this.adventurerID))
      })
      // this.adventurerWell.loadout.classList.add('clickable')
      this.adventurerWell.loadout.addEventListener('click', () => {
        // void this.app.setPage(new AdventurerStatsPage(this.adventurerID))
      })
      this._showDungeonButton()
    }
  }

  _showDungeonButton(){
    this.querySelector('.basic-dungeon').addEventListener('click', () => {
      void this.app.setPage(new DungeonPickerPage(this.adventurerID))
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)