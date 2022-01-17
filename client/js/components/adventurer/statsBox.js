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
    this.displayMode = 'normal'
  }

  setDisplayMode(displayMode) {
    this.displayMode = displayMode
    this.levelBar.setFill('#1affa0')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
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
    if(this.displayMode === 'normal'){
      this.levelBar.setLabel(this.adventurer.name)
      this.levelBar.setBadge(this.adventurer.level)
      this.levelBar.setRange(levelToXp(this.adventurer.level), levelToXp(this.adventurer.level + 1))
      this.levelBar.setValue(this.adventurer.xp)
    }else if(this.displayMode === 'dungeon'){
      // TODO: adventurer HP, adventurer state
      this.levelBar.setLabel(this.adventurer.name)
      this.levelBar.setRange(0, 100)
      this.levelBar.setValue(100)
    }
  }
}

customElements.define('di-adventurer-statsbox', StatsBox)