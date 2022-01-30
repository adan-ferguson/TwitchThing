import { levelToXp, xpToLevel } from '../../../../../game/adventurer.js'

const HTML = `
<div class="content-well">
  <div class="stats-box">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <div class="stats"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerWell extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('flex-rows')
    this.statsbox = this.querySelector('.stats-box')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.loadout = this.querySelector('di-loadout')
    this.displayMode = 'normal'
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
    this._update()
    // TODO: loadout
  }

  async addXp(xp){
    this.adventurer.xp += xp
    this.adventurer.level = xpToLevel(this.adventurer.xp)
    await this.xpBar.animateValue(this.adventurer.xp)
  }

  _update(){
    this.xpBar.setValue(this.adventurer.xp)
  }
}
customElements.define('di-adventurer-well', AdventurerWell )