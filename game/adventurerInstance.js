import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower, getAdventurerMods } from './adventurer.js'
import FighterInstance from './fighterInstance.js'
import { performVenturingTick, performVenturingTicks } from '../server/actionsAndTicks/performVenturingTicks.js'

export default class AdventurerInstance extends FighterInstance{

  adventurer

  constructor(adventurer, initialState = {}){
    super(adventurer, initialState)
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

  /**
   * Pass time (out of combat)
   * @param time
   */
  passTime(time){
    return performVenturingTicks(Math.floor(time / 1000))
  }
}