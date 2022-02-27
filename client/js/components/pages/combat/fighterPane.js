import FighterInstance from '../../../../../game/combat/fighterInstance.js'
import { fadeOut } from '../../../animationHelper.js'

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
    this.actionBar.showValueBeforeLabel = false
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.stats = this.querySelector('.stats')
    this.fighterInstance = null
  }

  setFighter(fighter){
    this.fighter = fighter
    this.querySelector('.name').textContent = fighter.name
    this.hpBar.setBadge(fighter.level || '')
  }

  setState(state = {}, animate = false){

    if(this._finished){
      return
    }

    this.fighterInstance = new FighterInstance(this.fighter, state)
    this._update(animate)
  }

  advanceTime(ms){

    if(this._finished){
      return
    }

    this.fighterInstance.advanceTime(ms)
    this._updateCooldowns()
  }

  _update(animate = false){

    if(this._finished){
      return
    }

    this.hpBar.setMax(this.fighterInstance.hpMax)

    if(this.fighterInstance.hp !== this.hpBar.value){
      if(animate){
        this.hpBar.setValue(this.fighterInstance.hp, {
          animate: true,
          flyingText: true
        })
      }else{
        this.hpBar.setValue(this.fighterInstance.hp)
      }
    }

    this.actionBar.setMax(this.fighterInstance.actionTime)

    // TODO: figure out this but better
    this.stats.innerHTML = ''
    const statsToShow = ['attack']
    statsToShow.forEach(statName => {
      const el = document.createElement('div')
      el.innerHTML = `${statName} ${this.fighterInstance.stats.getCompositeStat(statName)}`
      this.stats.appendChild(el)
    })

    this._updateCooldowns()

    if(!this.fighterInstance.hp){
      fadeOut(this, 2000)
      this._finished = true
    }
  }

  _updateCooldowns(){
    const timeInSeconds = Math.ceil(this.fighterInstance.timeUntilNextAction / 100) / 10
    this.actionBar.setValue(this.fighterInstance.currentState.timeSinceLastAction)
    this.actionBar.setLabel(timeInSeconds.toFixed(1))
    // TODO: update cooldowns for items and effects
  }
}

customElements.define('di-combat-fighter-pane', FighterPane )