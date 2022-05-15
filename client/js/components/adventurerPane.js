import { levelToXp, xpToLevel } from '../../../game/adventurer.js'
import { OrbsDisplayStyles } from './loadout/loadout.js'
import AdventurerInstance from '../../../game/adventurerInstance.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows top-section">
    <div class="name displaynone"></div>
    <di-xp-bar></di-xp-bar>
    <di-stats-list></di-stats-list>
  </div>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerPane extends HTMLElement{

  _hpBar
  _actionBar

  _extraStats

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this.name = this.querySelector('.name')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadoutEl = this.querySelector('di-loadout')
    this.loadoutEl.setOptions({
      orbsDisplayStyle: OrbsDisplayStyles.SHOW_MAXIMUM
    })
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      forcedStats: ['hpMax', 'speed', 'physPower']
    })
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.name.textContent = this.adventurer.name
    this.xpBar.setValue(this.adventurer.xp)

    this.loadoutEl.setFighter(this.adventurer)
    this.update()
  }

  setExtraStats(extraStats){
    this._extraStats = extraStats
    this.update()
  }

  update(){
    this.updateStats()
    this.loadoutEl.update()
  }

  updateStats(){
    const adventurerInstance = new AdventurerInstance({ ...this.adventurer, items: this.loadoutEl.items }, this._extraStats)
    this.statsList.setStats(adventurerInstance.stats, adventurerInstance)
  }

  async addXp(toAdd){
    await this.xpBar.setValue(this.adventurer.xp + toAdd, {
      animate: true
    })
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )