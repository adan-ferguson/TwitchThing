import { getAdventurerStats, levelToHp, levelToXp, xpToLevel } from '../../../game/adventurer.js'
import { OrbsDisplayStyles } from './loadout/loadout.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <di-hp-bar></di-hp-bar>
    <di-action-bar></di-action-bar>
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
    this._hpBar = this.querySelector('di-hp-bar')
    this._actionBar = this.querySelector('di-bar.action')
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
    const advCopy = { ...this.adventurer, items: this.loadoutEl.items }
    const stats = getAdventurerStats(advCopy, this._extraStats)
    this.statsList.setStats(stats)

    this._hpBar.setMax(levelToHp(advCopy.level) * stats.get('hpMax').value)
    this._hpBar.setValue(this._hpBar.max)
    this._actionBar.setMax()
    this._actionBar.setValue(0)
  }

  async addXp(toAdd){
    await this.xpBar.setValue(this.adventurer.xp + toAdd, {
      animate: true
    })
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )