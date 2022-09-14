import FighterInstance from './fighterInstance.js'
import Bonus from './bonus.js'
import AdventurerItemInstance from './adventurerItemInstance.js'
import OrbsData from './orbsData.js'
import ModsCollection from './modsCollection.js'
import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import scaledValue from './scaledValue.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.35

const HP_BASE = 50
const HP_GROWTH_PCT = 0.15
const POWER_BASE = 10
const POWER_GROWTH_PCT = 0.11

export function xpToLevel(xp){
  return LevelCalculator.xpToLevel(LEVEL_2_XP, XP_MULTIPLIER, xp)
}

export function levelToXp(lvl){
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

  get stats(){
    const bonusStatAffectors = this.fighterData.bonuses
      .map(bonusDef => new Bonus(bonusDef).stats)

    const loadoutStatAffectors = this.fighterData.items.filter(itemDef => itemDef)
      .map(itemDef => new AdventurerItemInstance(itemDef).stats)

    // TODO: extraz
    const stateAffectors = null
    return new Stats([
      ...bonusStatAffectors,
      ...loadoutStatAffectors
    ], stateAffectors)
  }

  get mods(){
    const bonusMods = this.fighterData.bonuses.map(bonus => new Bonus(bonus).mods)
    const loadoutMods = this.fighterData.items.filter(itemDef => itemDef)
      .map(itemDef => new AdventurerItemInstance(itemDef).mods)
    const stateMods = []
    return new ModsCollection(bonusMods, loadoutMods, stateMods)
  }

  get orbs(){
    const used = this.fighterData.bonuses.map(bonusDef => {
      return new Bonus(bonusDef).orbsData.maxOrbs
    })
    const max = this.itemInstances.map(ii => ii?.orbs || {})
    return new OrbsData(used, max)
  }
}