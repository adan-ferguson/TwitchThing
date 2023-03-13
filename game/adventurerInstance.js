import FighterInstance from './fighterInstance.js'
import AdventurerItemInstance from './adventurerSlotInstance.js'
import OrbsData from './orbsData.js'
import { geometricProgession, inverseGeometricProgression } from './growthFunctions.js'
import BonusesData from './bonusesData.js'
import { minMax } from './utilFunctions.js'
import { startingFoodStat } from './stats/combined.js'

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

  // get unspentOrbs(){
  //   return 100000
  // }
  //
  // get unspentSkillPoints(){
  //   return 100000
  // }

  getEquippedSlotBonus(slotIndex){
    // TODO: equipping of slot bonuses, for now the slot bonuses are just hardcoded
    return this.bonusesData.instances.find(bonusInstance => {
      return bonusInstance.slotBonus?.slotIndex === slotIndex
    })?.slotBonus
  }
}