import {
  getAdventurerStats,
  adventurerLevelToHp,
  adventurerLevelToPower,
  getAdventurerMods,
  getAdventurerOrbsData
} from './adventurer.js'
import FighterInstance from './fighterInstance.js'

export default class AdventurerInstance extends FighterInstance{

  adventurer

  constructor(adventurer, initialState = {}){
    super(adventurer, initialState)
    this.adventurer = adventurer
  }

  get uniqueID(){
    return this.adventurer._id.toString()
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

  get orbs(){
    return getAdventurerOrbsData(this.adventurer)
  }
}