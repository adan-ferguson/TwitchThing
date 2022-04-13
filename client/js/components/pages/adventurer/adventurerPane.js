import { getStats, levelToXp, xpToLevel } from '../../../../../game/adventurer.js'
import { OrbsDisplayStyles } from '../../loadout/loadout.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <di-stats-list></di-stats-list>
  </div>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerPane extends HTMLElement{

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
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.name.textContent = this.adventurer.name
    this.xpBar.setValue(this.adventurer.xp)
    this.statsList.setStats(getStats(this.adventurer))
    this.loadoutEl.setAdventurer(this.adventurer)
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )