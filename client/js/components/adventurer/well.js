import { levelToXp } from '/game/adventurer.js'

const HTML = `
  <di-bar></di-bar>
  <di-adventurer-statsbox></di-adventurer-statsbox>
  <di-loadout></di-loadout>
`

export default class AdventurerWell extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.levelBar = this.querySelector('di-bar')
    this.statsbox = this.querySelector('di-adventurer-statsbox')
    this.loadout = this.querySelector('di-loadout')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.levelBar.setLabel(adventurer.name)
    this.statsbox.setAdventurer(adventurer)
    this._updateLevelBar()
    // TODO: loadout
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
customElements.define('di-adventurer-well', AdventurerWell )