import { getStats, levelToXp, xpToLevel } from '../../../../../game/adventurer.js'
import StatRow from '../../stats/statRow.js'

const HTML = `
<div class="flex-rows">
  <div class="stats-box">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <div class="stats-list"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('adventurer-pane', 'fill-contents')
    this.innerHTML = HTML
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.statsList = this.querySelector('.stats-list')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
    this._update()
  }

  async addXp(xp){
    this.adventurer.xp += xp
    this.adventurer.level = xpToLevel(this.adventurer.xp)
    await this.xpBar.setValue(this.adventurer.xp, { animate: true })
  }

  _update(){
    this.xpBar.setValue(this.adventurer.xp)

    // TODO: add affectors from items
    // TODO: add affectors from effects
    const stats = getStats(this.adventurer)
    this.statsList.innerHTML = ''

    const statsToShow = stats.getAll()
    for(let key in statsToShow){
      this.statsList.appendChild(new StatRow(statsToShow[key]))
    }
  }
}
customElements.define('di-adventurer-pane', AdventurerPane)