import { levelToXp, xpToLevel } from '../../../../../game/adventurer.js'
import AdventurerStats from '../../../../../game/adventurerStats.js'

const HTML = `
<div class="content-well">
  <div class="flex-rows">
    <div class="stats-box">
      <div class="name"></div>
      <di-xp-bar></di-xp-bar>
      <div class="stats"></div>
    </div>
    <di-loadout></di-loadout>
  </div>
</div>
`

export default class AdventurerWell extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('flex-rows')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.stats = this.querySelector('.stats')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
    this._update()
  }

  async addXp(xp){
    this.adventurer.xp += xp
    this.adventurer.level = xpToLevel(this.adventurer.xp)
    await this.xpBar.animateValue(this.adventurer.xp)
  }

  _update(){
    this.xpBar.setValue(this.adventurer.xp)

    const stats = new AdventurerStats(this.adventurer)
    this.stats.innerHTML = ''

    // TODO: figure out this but better
    const statsToShow = ['hp', 'attack']
    statsToShow.forEach(statName => {
      const el = document.createElement('div')
      el.innerHTML = `${statName} ${stats[statName]}`
      this.stats.appendChild(el)
    })
  }
}
customElements.define('di-adventurer-well', AdventurerWell )