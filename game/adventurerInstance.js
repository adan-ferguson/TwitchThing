import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower } from './adventurer.js'
import { COMBAT_BASE_TURN_TIME } from './combat/fighterInstance.js'
import { randomRound } from './rando.js'

export default class AdventurerInstance{

  static initialState(adventurer){
    const ai = new AdventurerInstance(adventurer)
    return ai.adventurerState
  }

  constructor(adventurer, adventurerState = {}){
    this.adventurer = adventurer
    this.adventurerState = { ...adventurerState }
    if(!('hp' in adventurerState)){
      this.adventurerState.hp = this.hpMax
    }
  }

  get baseHp(){
    return adventurerLevelToHp(this.adventurer.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.adventurer.level)
  }

  get name(){
    return this.adventurer.name
  }

  get stats(){
    return getAdventurerStats(this.adventurer, this.adventurerState)
  }

  get hp(){
    return this.adventurerState.hp
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  get hpMax(){
    return Math.ceil(adventurerLevelToHp(this.adventurer.level) * this.stats.get('hpMax').value)
  }

  get actionTime(){
    return COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  passTime(time){
    const turns = time / 5000
    const regen = this.stats.get('regen').value
    if(regen){
      const amount = randomRound(turns * this.hpMax * regen)
      this.adventurerState.hp = Math.min(this.hpMax, this.hp + amount)
    }
  }
}