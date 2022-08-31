import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower, getAdventurerMods } from './adventurer.js'
import FighterInstance, { COMBAT_BASE_TURN_TIME } from './fighterInstance.js'
import { randomRound } from './rando.js'

export default class AdventurerInstance extends FighterInstance{

  adventurer

  constructor(adventurer, initialState = {}){
    super(initialState)
    this.adventurer = adventurer
  }

  get baseHp(){
    return adventurerLevelToHp(this.adventurer.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.adventurer.level)
  }

  get displayName(){
    return this.adventurer.name
  }

  get stats(){
    return getAdventurerStats(this.adventurer, this._currentState)
  }

  get mods(){
    return getAdventurerMods(this.adventurer, this._currentState)
  }

  // passTime(time){
  //   const turns = time / 5000
  //   const regen = this.stats.get('regen').value
  //   if(regen){
  //     const amount = randomRound(turns * this.hpMax * regen)
  //     this.adventurerState.hp = Math.min(this.hpMax, this.hp + amount)
  //   }
  // }
}