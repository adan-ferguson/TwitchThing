import { getActiveStats } from '../../../../../game/adventurer.js'
import StatRow from '../../stats/statRow.js'

const HTML = `
<div class="flex-rows">
  <div class="stats-box">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <div class="stats-list"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('adventurer-pane')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.statsList = this.querySelector('.stats-list')
    this.displayMode = 'normal'
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.hpBar.setBadge(adventurer.level)
    this.querySelector('.name').textContent = adventurer.name
  }

  setState(state = {}){
    const animateChanges = this.state ? true : false
    this.state = {
      hp: this.adventurer.baseStats.hpMax,
      ...state }
    this._update(animateChanges)
  }

  _update(animateChanges){
    // TODO: add affectors from items
    // TODO: add affectors from effects
    const stats = getActiveStats(this.adventurer, this.state)
    this.hpBar.setRange(0, stats.get('hpMax').value)
    this.hpBar.setValue(this.state.hp)

    this.statsList.innerHTML = ''

    const statsToShow = stats.getAll()
    for(let key in statsToShow){
      this.statsList.appendChild(new StatRow(statsToShow[key]))
    }
  }
}

customElements.define('di-dungeon-adventurer-pane', AdventurerPane )