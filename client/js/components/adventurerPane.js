import { levelToXp, xpToLevel } from '../../../game/adventurer.js'
import AdventurerInstance from '../../../game/adventurerInstance.js'
import { adventurerLoadoutContents } from '../adventurer.js'
import { OrbsDisplayStyle } from './orbRow.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows top-section">
    <div class="name"></div>
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
    this._name = this.querySelector('div.name')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadoutEl = this.querySelector('di-loadout')
    this.loadoutEl.setOptions({
      orbsDisplayStyle: OrbsDisplayStyle.SHOW_MAX
    })
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      forcedStats: ['hpMax', 'speed', 'physPower']
    })
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this._name.textContent = adventurer.name
    this.xpBar.setValue(this.adventurer.xp)
    this.loadoutEl.setContents(adventurerLoadoutContents(this.adventurer))
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

  async addXp(toAdd, onLevelup = null){
    await this.xpBar.setValue(this.adventurer.xp + toAdd, {
      animate: true,
      onLevelup: level => {
        this.adventurer.level = level
        this.update()
        if(onLevelup){
          onLevelup(level)
        }
      }
    })
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )