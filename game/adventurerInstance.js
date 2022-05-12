import { getIdleAdventurerStats } from './adventurer.js'

export const ADVENTURER_BASE_ROOM_TIME = 5000

export default class AdventurerInstance{

  static initialState(adventurer){
    const ai = new AdventurerInstance(adventurer)
    return ai.adventurerState
  }

  constructor(adventurer, adventurerState = {}){
    if(!adventurer.baseHp || !adventurer.basePower){
      throw 'adventurer doc requires baseHp and basePower properties.'
    }
    this.adventurer = adventurer
    this.adventurerState = { ...adventurerState }
    if(!('hp' in adventurerState)){
      adventurerState.hp = this.hpMax
    }
  }

  get name(){
    return this.adventurer.name
  }

  get stats(){
    // TODO: apply state
    return getIdleAdventurerStats({ adventurer: this.adventurer })
  }

  get hp(){
    return this.adventurerState.hp
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  get hpMax(){
    return Math.ceil(this.adventurer.baseHp * this.stats.get('hpMax').value)
  }

  get power(){
    return this.adventurer.basePower
  }

  get standardRoomDuration(){
    return ADVENTURER_BASE_ROOM_TIME
  }
}