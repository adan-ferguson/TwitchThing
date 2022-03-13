import Stats from '../stats/stats.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

export const COMBAT_BASE_TURN_TIME = 3000

export default class FighterInstance{

  constructor(fighter, fighterStartState){

    checkValidity(fighter)

    this.baseFighter = fighter
    this._currentState = {
      ...STATE_DEFAULTS,
      ...fighterStartState
    }
    if(!('hp' in this._currentState)){
      this._currentState.hp = this.stats.get('hpMax').value
    }
  }

  get fighterType(){
    return this.baseFighter.adventurerID ? 'adventurer' : 'monster'
  }

  get stats(){
    // TODO: add affectors from items
    // TODO: add affectors from effects
    return new Stats([ this.baseFighter.baseStats ])
  }

  get currentState(){
    return { ...this._currentState }
  }

  get actionTime(){
    return COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.actionTime - this.currentState.timeSinceLastAction)))
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return this._currentState.hp
  }

  set hp(val){
    this._currentState.hp = Math.min(this.hpMax, Math.max(0, val))
  }

  get hpMax(){
    return this.stats.get('hpMax').value
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
  }

  performAction(enemy){
    let baseDamage = this.stats.get('attack').value
    const damageResult = this._dealDamage(baseDamage, enemy)
    this._currentState.timeSinceLastAction = 0

    return {
      actionType: 'attack',
      result: damageResult
    }
  }

  tick(){
    return []
  }

  _dealDamage(amount, enemy){
    const damageResult = enemy._takeDamage(amount)

    const lifesteal = this._lifesteal(damageResult.damage)
    if(lifesteal){
      damageResult.lifesteal = lifesteal
    }

    return damageResult
  }

  _lifesteal(damage){
    const lifesteal = Math.min(
      this.hpMax - this.hp,
      Math.ceil(this.stats.get('lifesteal').value * damage)
    )
    this.hp += lifesteal
    return lifesteal
  }

  _takeDamage(preMitigationDamage){
    const blocked = preMitigationDamage * this.stats.get('physDef').value
    const finalDamage = Math.min(this.hp, preMitigationDamage - blocked)
    this.hp -= finalDamage
    return {
      damage: finalDamage,
      blocked
    }
  }
}

function checkValidity(fighter){
  if(!fighter.name){
    throw 'fighter name is required'
  }
  if(!fighter.baseStats?.hpMax){
    throw 'fighter hpMax is required'
  }
  if(!fighter.baseStats?.attack){
    throw 'fighter attack is required'
  }
  if(!fighter.loadout){
    throw 'fighter loadout is required'
  }
}