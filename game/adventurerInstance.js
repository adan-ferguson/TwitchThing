import { getIdleAdventurerStats } from './adventurer.js'

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
    // TODO: apply state
    return getIdleAdventurerStats({ adventurer: this.adventurer })
  }

  get hpPct(){
    return this.adventurerState.hp / this.hpMax
  }

  get hpMax(){
    return this.stats.get('hpMax').value
  }

  get standardRoomDuration(){
    return ADVENTURER_BASE_ROOM_TIME / this.stats.get('adventuringSpeed').value
  }
}