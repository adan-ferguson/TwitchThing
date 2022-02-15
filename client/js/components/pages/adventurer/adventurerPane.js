import { levelToXp, xpToLevel } from '../../../../../game/adventurer.js'
import Stats from '../../../../../game/stats.js'

const HTML = `
<div class="flex-rows">
  <div class="stats-box">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <div class="stats"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('adventurer-pane')
    this.innerHTML = HTML
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

    // TODO: add affectors from items
    // TODO: add affectors from effects
    const stats = new Stats([this.adventurer.baseStats])
    this.stats.innerHTML = ''

    // TODO: figure out this but better
    const statsToShow = ['hpMax', 'attack']
    statsToShow.forEach(statName => {
      const el = document.createElement('div')
      el.innerHTML = `${statName} ${stats.getCompositeStat(statName)}`
      this.stats.appendChild(el)
    })
  }
}
customElements.define('di-adventurer-pane', AdventurerPane)