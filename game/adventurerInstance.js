import { getActiveStats } from './adventurer.js'

export const ADVENTURER_BASE_ROOM_TIME = 3000

export default class AdventurerInstance{
  constructor(adventurer, adventurerState){
    this.adventurer = adventurer
    this.adventurerState = adventurerState
  }

  get name(){
    return this.adventurer.name
  }

  get stats(){
    return getActiveStats(this.adventurer, this.adventurerState)
  }

  get hpPct(){
    return this.adventurerState.hp / this.hpMax
  }

  get hpMax(){
    return this.stats.get('hpMax').convertedValue
  }

  get standardRoomDuration(){
    return ADVENTURER_BASE_ROOM_TIME / this.stats.get('adventuringSpeed').convertedValue
  }
}