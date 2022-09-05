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

  constructor(adventurerDef, initialState = {}){
    super(adventurerDef, initialState)
    this._adventurerDef = adventurerDef
  }

  get uniqueID(){
    return this.adventurer._id.toString()
  }

  get ItemClass(){
    return AdventurerInstance
  }

  get baseHp(){
    return adventurerLevelToHp(this.adventurer.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.adventurer.level)
  }

  get stats(){
    return getAdventurerStats(this)
  }

  get mods(){
    return getAdventurerMods(this)
  }

  get orbs(){
    return getAdventurerOrbsData(this)
  }
}