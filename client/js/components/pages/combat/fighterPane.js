import FighterInstance from '../../../../../game/combat/fighterInstance.js'
import { fadeOut } from '../../../animationHelper.js'
import { StatsDisplayScope } from '../../../statsDisplayInfo.js'
import FlyingTextEffect from '../../effects/flyingTextEffect.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'
import { adventurerLoadoutContents } from '../../../adventurer.js'
import { monsterLoadoutContents } from '../../../monster.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <di-action-bar></di-action-bar>
    <di-stats-list></di-stats-list>
  </div>   
</div>
<di-loadout></di-loadout>    
`

export default class FighterPane extends HTMLElement{

  fighter

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.actionBar = this.querySelector('di-action-bar')
    this.loadout = this.querySelector('di-loadout')
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      statsDisplayScope: StatsDisplayScope.COMBAT,
      noHP: true
    })
    this.fighterInstance = null
  }

  get isAdventurer(){
    // Monsters have mods, not items
    return this.fighter?.items ? true : false
  }

  setFighter(fighter){
    this.fighter = fighter
    this.querySelector('.name').textContent = fighter.displayname || toDisplayName(fighter.name)
    if(this.isAdventurer){
      this.loadout.setContents(adventurerLoadoutContents(this.fighter))
    }else{
      this.loadout.setContents(monsterLoadoutContents(this.fighter))
    }
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

  displayDamageTaken(damageResult){

    let html = `<span class="damage">-${damageResult.damage}</span>`

    if(damageResult.blocked){
      html += `<span class="blocked">(${damageResult.blocked} blocked)</span>`
    }

    new FlyingTextEffect(this.hpBar, html, {
      html: true
    })
  }

  displayLifeGained(amount){
    new FlyingTextEffect(this.hpBar, amount)
  }

  _update(animate = false){

    if(this._finished){
      return
    }

    this.hpBar.setOptions({ max: this.fighterInstance.hpMax })

    if(this.fighterInstance.hp !== this.hpBar.value){
      if(animate){
        this.hpBar.setValue(this.fighterInstance.hp, {
          animate: true
        })
      }else{
        this.hpBar.setValue(this.fighterInstance.hp)
      }
    }

    this.statsList.setStats(this.fighterInstance.stats)
    this._updateCooldowns()

    if(!this.fighterInstance.hp){
      fadeOut(this, 2000)
      this._finished = true
    }
  }

  _updateCooldowns(){
    this.actionBar.setTime(
      this.fighterInstance.currentState.timeSinceLastAction,
      this.fighterInstance.timeUntilNextAction
    )
    // TODO: update cooldowns for items and effects
  }
}

customElements.define('di-combat-fighter-pane', FighterPane )