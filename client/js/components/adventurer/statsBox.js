import '../bar.js'
import { levelToXp } from '../../../../game/adventurer.js'

const HTML = `
<div class="name"></div>
<di-bar></di-bar>
<div class="health">Other stats here</div>
`

export default class StatsBox extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('content-well')
    this.levelBar = this.querySelector('di-bar')
    this.displayMode = 'normal'
  }

  setDisplayMode(displayMode) {
    this.displayMode = displayMode
    this.levelBar.setFill('#1affa0')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
    this._updateLevelBar()
  }

  async addXp(xpToAdd){
    while(xpToAdd > 0){
      let toNextLevel = this.levelBar.max - this.adventurer.xp
      if (xpToAdd >= toNextLevel) {
        await this.levelBar.animateValue(this.levelBar.max)
        // TODO: flying text "Level Up!"
        // TODO: editing the adventurer here seems a bit wonky
        this.adventurer.xp += toNextLevel
        this.adventurer.level++
        await this._updateLevelBar()
        xpToAdd -= toNextLevel
      }else{
        await this.levelBar.animateValue(this.adventurer.xp + xpToAdd)
        xpToAdd = 0
      }
    }
  }

  _updateLevelBar(){
    this.levelBar.setBadge(this.adventurer.level)
    if(this.displayMode === 'normal'){
      this.levelBar.setRange(levelToXp(this.adventurer.level), levelToXp(this.adventurer.level + 1))
      this.levelBar.setLabel('xp')
      this.levelBar.setValue(this.adventurer.xp)
    }else if(this.displayMode === 'dungeon'){
      // TODO: adventurer HP, adventurer state
      this.levelBar.setRange(0, 100)
      this.levelBar.setLabel('hp')
      this.levelBar.setValue(100)
    }
  }
}

customElements.define('di-adventurer-statsbox', StatsBox)