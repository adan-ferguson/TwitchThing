import FighterInstance from './fighterInstance.js'
import AdventurerItemInstance from './adventurerSlotInstance.js'
import OrbsData from './orbsData.js'
import { geometricProgession, inverseGeometricProgression } from './growthFunctions.js'
import BonusesData from './bonusesData.js'
import { minMax, toNumberOfDigits } from './utilFunctions.js'
import { startingFoodStat } from './stats/combined.js'

const XP_BASE = 100
const XP_GROWTH = 200
const XP_GROWTH_PCT = 0.3

const HP_BASE = 40
const HP_GROWTH = 18
const HP_GROWTH_PCT = 0.05

const POWER_BASE = 10
const POWER_GROWTH = 3
const POWER_GROWTH_PCT = 0.05

export function advXpToLevel(xp){
  if(xp < XP_BASE){
    return 1
  }
  const lvl = Math.floor(inverseGeometricProgression(XP_GROWTH_PCT, xp - XP_BASE, XP_GROWTH)) + 2
  return advLevelToXp(lvl) <= xp ? lvl : lvl - 1
}

export function advLevelToXp(lvl){
  if(lvl <= 1){
    return 0
  }
  return toNumberOfDigits(
    Math.round(geometricProgession(XP_GROWTH_PCT, lvl - 2, XP_GROWTH)) + XP_BASE,
    3
  )
}

export function adventurerLevelToHp(lvl){
  return HP_BASE + Math.ceil(geometricProgession(HP_GROWTH_PCT, lvl - 1, HP_GROWTH))
}

export function adventurerLevelToPower(lvl){
  return POWER_BASE + Math.ceil(geometricProgession(POWER_GROWTH_PCT, lvl - 1, POWER_GROWTH))
}

export default class AdventurerInstance extends FighterInstance{

  constructor(adventurerDef, initialState = {}){
    super(adventurerDef, initialState)
    this.bonusesData = new BonusesData(adventurerDef.bonuses, this)
  }

  get accomplishments(){
    return this.fighterData.accomplishments
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
    return [
      {
        [startingFoodStat.name]: 3
      },
      ...this.bonuses.map(bonusInstance => bonusInstance.stats)
    ]
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

  get maxFood(){
    return this.stats.get(startingFoodStat).value
  }

  get food(){
    return this._state.food ?? this.maxFood
  }

  set food(val){
    this._state.food = minMax(0, val, this.maxFood)
  }

  get isLoadoutValid(){
    const orbs = this.orbs
    if(!orbs.isValid){
      return false
    }
    return true
  }

  get unspentOrbs(){
    return 100000
  }

  get unspentSkillPoints(){
    return 100000
  }

  getEquippedSlotBonus(slotIndex){
    // TODO: equipping of slot bonuses, for now the slot bonuses are just hardcoded
    return this.bonusesData.instances.find(bonusInstance => {
      return bonusInstance.slotBonus?.slotIndex === slotIndex
    })?.slotBonus
  }
}