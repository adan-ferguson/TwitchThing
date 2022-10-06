import FighterInstance from './fighterInstance.js'
import AdventurerItemInstance from './adventurerItemInstance.js'
import OrbsData from './orbsData.js'
import LevelCalculator from './levelCalculator.js'
import { scaledValue } from './scaledValue.js'
import BonusesData from './bonusesData.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.35

const HP_BASE = 50
const HP_GROWTH_PCT = 0.15
const POWER_BASE = 10
const POWER_GROWTH_PCT = 0.11

export function advXpToLevel(xp){
  return LevelCalculator.xpToLevel(LEVEL_2_XP, XP_MULTIPLIER, xp)
}

export function advLevelToXp(lvl){
  return LevelCalculator.levelToXp(LEVEL_2_XP, XP_MULTIPLIER, lvl)
}

export function adventurerLevelToHp(lvl){
  return Math.ceil(scaledValue(HP_GROWTH_PCT, lvl - 1, HP_BASE))
}

export function adventurerLevelToPower(lvl){
  return Math.ceil(scaledValue(POWER_GROWTH_PCT, lvl - 1, POWER_BASE))
}

export default class AdventurerInstance extends FighterInstance{

  constructor(adventurerDef, initialState = {}){
    super(adventurerDef, initialState)
    this.bonusesData = new BonusesData(adventurerDef.bonuses)
  }

  get bonuses(){
    return this.bonusesData.instances
  }

  get displayName(){
    return this.fighterData.name
  }

  get uniqueID(){
    return this.fighterData._id.toString()
  }

  get ItemClass(){
    return AdventurerItemInstance
  }

  get baseHp(){
    return adventurerLevelToHp(this.fighterData.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.fighterData.level)
  }

  get baseStats(){
    return this.bonuses.map(bonusInstance => bonusInstance.stats)
  }

  get baseMods(){
    return this.bonuses.map(bonusInstance => bonusInstance.mods)
  }

  get orbs(){
    const used = this.bonuses.map(bonusInstance => {
      return bonusInstance.orbsData.maxOrbs
    })
    const max = this.itemInstances.map(ii => ii?.orbs || {})
    return new OrbsData(used, max)
  }

  get effectInstances(){
    return [...this.bonuses, ...super.effectInstances]
  }
}