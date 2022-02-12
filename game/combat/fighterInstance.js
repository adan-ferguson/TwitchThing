import Stats from '../stats.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

const BASE_TURN_TIME = 3000

export default class FighterInstance{

  constructor(fighter, fighterStartState){
    this.baseFighter = fighter
    this._currentState = {
      ...STATE_DEFAULTS,
      ...fighterStartState
    }
    if(!('hp' in this._currentState)){
      this._currentState.hp = this.stats.getCompositeStat('hpMax')
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

  get timeUntilNextAction(){
    const actionTime = BASE_TURN_TIME / this.stats.getPctStatMod('speed')
    return Math.max(0, (actionTime - this.currentState.timeSinceLastAction))
  }

  get hp(){
    this._currentState.hp = Math.min(this.hpMax, this._currentState.hp)
    return this._currentState.hp
  }

  get hpMax(){
    return this.stats.getCompositeStat('hpMax')
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
  }

  performAction(){
    return []
  }

  tick(){
    return []
  }
}