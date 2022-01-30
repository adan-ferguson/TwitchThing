import ActiveAdventurerStats from '../../../../../game/activeAdventurerStats.js'
import AdventurerStats from '../../../../../game/adventurerStats.js'

const HTML = `
<div class="stats-box content-well">
  <div class="name"></div>
  <di-hp-bar></di-hp-bar>
  <div class="stats"></div>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerWell extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('flex-rows')
    this.hpBar = this.querySelector('di-hp-bar')
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.displayMode = 'normal'
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.hpBar.setLabel(adventurer.level)
    this.querySelector('.name').textContent = adventurer.name
  }

  setState(state = {}){
    const animateChanges = this.state ? true : false
    this.state = state
    this._update(animateChanges)
  }

  _update(animateChanges){
    const stats = new AdventurerStats(this.adventurer)
    const activeStats = new ActiveAdventurerStats(stats, this.state)
    this.hpBar.setValue(activeStats.hp)
    this.hpBar.setRange(0, activeStats.maxHp)
  }
}
customElements.define('di-dungeon-adventurer-well', AdventurerWell )