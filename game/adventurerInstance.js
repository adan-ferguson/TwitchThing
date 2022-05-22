import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower } from './adventurer.js'
import { COMBAT_BASE_TURN_TIME } from './combat/fighterInstance.js'

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
}