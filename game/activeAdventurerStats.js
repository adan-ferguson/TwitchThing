import AdventurerStats from './adventurerStats.js'
import Stats from './stats.js'

export default class ActiveAdventurerStats extends Stats {
  constructor(adventurer, adventurerState){
    super()
    this.adventurer = adventurer
    this.adventurerStats = new AdventurerStats(adventurer)
    this.updateState(adventurerState)
  }

  get level(){
    return this.adventurer.level
  }

  get statAffectors(){
    const stateStatAffectors = [] // TODO: derive from adventurer state
    return [...this.adventurerStats.statAffectors, ...stateStatAffectors]
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

  updateState(adventurerState){
    this.adventurerState = adventurerState
  }
}