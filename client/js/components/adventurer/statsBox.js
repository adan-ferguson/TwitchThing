import '../bar.js'
import { levelToXp } from '../../../../game/adventurer.js'

const HTML = `
<di-bar></di-bar>
<div class="health">Other stats here</div>
`

export default class StatsBox extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('content-well')
    this.levelBar = this.querySelector('di-bar')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.levelBar.setLabel(adventurer.name)
    this._updateLevelBar()
  }

  async addXp(xpToAdd){
    while(xpToAdd > 0){
      let toNextLevel = this.levelBar.max - this.levelBar.min
      if (xpToAdd >= toNextLevel) {
        await this.levelBar.animateValueChange(toNextLevel)
        // TODO: flying text "Level Up!"
        // TODO: editing the adventurer here seems a bit wonky
        this.adventurer.xp += toNextLevel
        this.adventurer.level++
        await this._updateLevelBar()
        xpToAdd -= toNextLevel
      }else{
        await this.levelBar.animateValueChange(xpToAdd)
        xpToAdd = 0
      }
    }
  }

  _updateLevelBar(){
    this.levelBar.setBadge(this.adventurer.level)
    this.levelBar.setRange(levelToXp(this.adventurer.level), levelToXp(this.adventurer.level + 1))
    this.levelBar.setValue(this.adventurer.xp)
  }
}

customElements.define('di-adventurer-statsbox', StatsBox)