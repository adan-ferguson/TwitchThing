import Page from '../page.js'
import MainPage from '../main/mainPage.js'
import AdventurerStatsPage from '../adventurerStats/adventurerStatsPage.js'
import AdventurerLoadoutPage from '../adventurerLoadout/adventurerLoadoutPage.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'
import LevelupPage from '../levelup/levelupPage.js'

import Stats from './stats.js'
import Loadout from './loadout.js'

import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="flex-columns">
  <div class="flex-rows">
    <div class="stats content-well clickable"></div>
    <div class="loadout content-well clickable"></div>
  </div>
  <div class="flex-rows dungeons">
      <div class="basic-dungeon content-well clickable">Enter Dungeon</div>
      <div class="something-else content-well">Something Else Goes Here</div>
  </div>
  <div class="flex-rows levelup displaynone">
      <div class="levelup content-well clickable">Level Up</div>
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
    const result = await fizzetch('/game/pagedata/adventurer', { id: this.adventurerID })
    if(result.error){
      return result.error
    }else{
      // TODO: redirect to dungeon page if adventurer is in one
      this.adventurer = result.adventurer
      this._showStats()
      this._showLoadout()
      this._showDungeonOrLevelupButton()
    }
  }

  _showStats(){
    const stats = this.querySelector('.stats')
    stats.addEventListener('click', () => {
      // void this.app.setPage(new AdventurerStatsPage(this.adventurerID))
    })
    stats.appendChild(new Stats(this.adventurer))
  }

  _showLoadout(){
    const loadout = this.querySelector('.loadout')
    loadout.addEventListener('click', () => {
      // void this.app.setPage(new AdventurerLoadoutPage(this.adventurerID))
    })
    loadout.appendChild(new Loadout(this.adventurer))
  }

  _showDungeonOrLevelupButton(){
    // TODO: if pending levelup, show the levelup one instead
    this.querySelector('.basic-dungeon').addEventListener('click', () => {
      // void this.app.setPage(new DungeonPickerPage(this.adventurerID))
    })
    this.querySelector('.levelup').addEventListener('click', () => {
      // void this.app.setPage(new LevelupPage(this.adventurerID))
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)