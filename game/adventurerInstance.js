import FighterInstance from './fighterInstance.js'
import AdventurerItemInstance from './adventurerItemInstance.js'
import OrbsData from './orbsData.js'
import { exponentialValueCumulative } from './exponentialValue.js'
import BonusesData from './bonusesData.js'
import { toNumberOfDigits } from './utilFunctions.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.25

const HP_BASE = 40
const HP_GROWTH = 20
const HP_GROWTH_PCT = 0.08

const POWER_BASE = 10
const POWER_GROWTH = 5
const POWER_GROWTH_PCT = 0.07

export function advXpToLevel(xp){
  let lvl = 1
  while(xp >= advLevelToXp(lvl + 1)){
    lvl++
  }
  return lvl
}

export function advLevelToXp(lvl){
  return toNumberOfDigits(
    Math.ceil(exponentialValueCumulative(XP_MULTIPLIER, lvl - 1, LEVEL_2_XP)),
    3
  )
}

export function adventurerLevelToHp(lvl){
  return HP_BASE + Math.ceil(exponentialValueCumulative(HP_GROWTH_PCT, lvl, HP_GROWTH))
}

export function adventurerLevelToPower(lvl){
  return POWER_BASE + Math.ceil(exponentialValueCumulative(POWER_GROWTH_PCT, lvl, POWER_GROWTH))
}

export default class AdventurerInstance extends FighterInstance{

  constructor(adventurerDef, initialState = {}){
    super(adventurerDef, initialState)
    this.bonusesData = new BonusesData(adventurerDef.bonuses, this)
  }

  get level(){
    return advXpToLevel(this._fighterData.xp)
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
    return adventurerLevelToHp(this.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.level)
  }

  get baseStats(){
    return this.bonuses.map(bonusInstance => bonusInstance.stats)
  }

  get baseMods(){
    return this.bonuses.map(bonusInstance => bonusInstance.mods)
  }

  get orbs(){
    const max = this.bonuses.map(bonusInstance => {
      return bonusInstance.orbsData.maxOrbs
    })
    const used = this.itemInstances.map(ii => ii?.orbs.maxOrbs || {})
    return new OrbsData(max, used)
  }

  get effectInstances(){
    return [...this.bonuses, ...super.effectInstances]
  }

  get shouldLevelUp(){
    return this.bonusesData.levelTotal < this.level
  }

  getEquippedSlotBonus(slotIndex){
    // TODO: equipping of slot bonuses, for now the slot bonuses are just hardcoded
    return this.bonusesData.instances.find(bonusInstance => {
      return bonusInstance.slotBonus?.slotIndex === slotIndex
    }).slotBonus
  }
}