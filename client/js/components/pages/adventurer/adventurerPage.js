import Page from '../page.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

import fizzetch from '../../../fizzetch.js'
import { getStats, levelToXp, xpToLevel } from '../../../../../game/adventurer.js'
import AdventurerLoadoutPage from '../adventurerLoadout/adventurerLoadoutPage.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <div class="content-well adventurer-info">
      <div class="flex-rows">
        <div class="adventurer-name"></div>
        <di-xp-bar></di-xp-bar>
        <di-stats-list></di-stats-list>
      </div>
    </div>
    <div class="content-well clickable content-no-grow">
      <di-loadout></di-loadout>
    </div>
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
    this.name = this.querySelector('.adventurer-name')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadout = this.querySelector('di-loadout')
    this.statsList = this.querySelector('di-stats-list')
  }

  async load(){

    const result = await fizzetch(`/game/adventurer/${this.adventurerID}`)
    if(result.error){
      return result
    }

    this.adventurer = result.adventurer
    this.name.textContent = this.adventurer.name
    this.xpBar.setValue(this.adventurer.xp)
    this.statsList.setStats(getStats(this.adventurer))
    this.loadout.setLoadout(this.adventurer)
    this.loadout.addEventListener('click', () => {
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