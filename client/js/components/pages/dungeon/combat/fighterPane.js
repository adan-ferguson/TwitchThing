import FighterInstance from '../../../../../../game/combat/fighterInstance.js'
import { fadeOut } from '../../../../animationHelper.js'
import { StatsDisplayScope } from '../../../../statsDisplayInfo.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <di-bar class="action"></di-bar>
    <di-stats-list></di-stats-list>
  </div>   
</div>
<di-loadout></di-loadout>    
`

export default class FighterPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.actionBar = this.querySelector('di-bar.action')
    this.actionBar.showValueBeforeLabel = false
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      statsDisplayScope: StatsDisplayScope.COMBAT,
      noHP: true
    })
    this.fighterInstance = null
  }

  setFighter(fighter){
    this.fighter = fighter
    this.querySelector('.name').textContent = fighter.name
    this.hpBar.setBadge(fighter.level || '')
    this.loadout.setFighter(fighter)
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
    this.statsList.setStats(this.fighterInstance.stats)
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