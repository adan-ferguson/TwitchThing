import { getIdleAdventurerStats, levelToHp } from './adventurer.js'

export const ADVENTURER_BASE_ROOM_TIME = 5000

export default class AdventurerInstance{
  constructor(adventurer, adventurerState = {}){
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
    return Math.ceil(levelToHp(this.adventurer.level) * this.stats.get('hpMax').value)
  }

  get standardRoomDuration(){
    return ADVENTURER_BASE_ROOM_TIME
  }
}