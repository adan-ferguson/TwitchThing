import FighterInstance from '../../../../../game/combat/fighterInstance.js'

const HTML = `
<div class="flex-rows">
  <div class="stats-box">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <di-bar class="action"></di-bar>
    <div class="stats"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class FighterPane extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.actionBar = this.querySelector('di-bar.action')
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.stats = this.querySelector('.stats')
    this.fighterInstance = null
    this.displayMode = 'normal'
  }

  setFighter(fighter){
    this.fighter = fighter
    this.hpBar.setBadge(fighter.level)
    this.querySelector('.name').textContent = fighter.name
  }

  setState(state = {}){
    this.fighterInstance = new FighterInstance(this.fighter, state)
    this._update()
  }

  advanceTime(ms){
    this.fighterInstance.advanceTime(ms)
    this._updateCooldowns()
  }

  _update(){
    this.hpBar.setMax(this.fighterInstance.hpMax)
    this.hpBar.setValue(this.fighterInstance.hp)
    this.actionBar.setMax(this.fighterInstance.actionTime)

    // TODO: figure out this but better
    const statsToShow = ['attack']
    statsToShow.forEach(statName => {
      const el = document.createElement('div')
      el.innerHTML = `${statName} ${this.fighterInstance.stats.getCompositeStat(statName)}`
      this.stats.appendChild(el)
    })

    this._updateCooldowns()
  }

  _updateCooldowns(){
    const timeInSeconds = Math.ceil(this.fighterInstance.timeUntilNextAction / 100) / 10
    this.actionBar.setValue(this.fighterInstance.currentState.timeSinceLastAction)
    this.actionBar.setLabel(timeInSeconds)
    // TODO: update cooldowns for items and effects
  }
}

customElements.define('di-combat-fighter-pane', FighterPane )