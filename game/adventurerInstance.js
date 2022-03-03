import { getActiveStats } from './adventurer.js'

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
    return this.stats.getCompositeStat('hpMax')
  }
}