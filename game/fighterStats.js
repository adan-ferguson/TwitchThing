import Stats from './stats.js'
import AdventurerStats from './adventurerStats.js'
import MonsterStats from './monsterStats.js'

const BASE_TURN_TIME = 3000

const STATE_DEFAULTS = {
  timeSinceLastAction: 0,
  hp: 0
}

export default class FighterStats extends Stats{

  constructor(fighter, fighterState){
    super()
    this.fighter = fighter
    this._fighterState = {
      ...STATE_DEFAULTS,
      ...fighterState
    }

    if(fighter.adventurerID){
      this._baseStats = new AdventurerStats(fighter)
    }else{
      this._baseStats = new MonsterStats(fighter)
    }
  }

  get hp(){
    if('hp' in this.adventurerState){
      return Math.max(0, Math.min(this.maxHp, this.adventurerState.hp))
    }
    return this.maxHp
  }

  /**
   * @returns {number}
   */
  get maxHp(){
    return this._getStat('hp')
  }

  get attack(){
    return this._getStat('attack')
  }

  get statAffectors(){
    const stateStatAffectors = [] // TODO: derive from adventurer state (debuffs/buffs)
    return [...this._baseStats.statAffectors, ...stateStatAffectors]
  }

  get actionTime(){
    return BASE_TURN_TIME / this._getPctStatMod('speed')
  }

  get timeUntilNextAction(){
    return Math.max(0, (this.actionTime - this._fighterState.timeSinceLastAction))
  }
}