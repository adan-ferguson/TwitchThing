import FighterInstance  from './fighterInstance.js'
import * as Monsters from './monsters/combined.js'
import MonsterItemInstance from './monsterItemInstance.js'
import { geometricProgession } from './growthFunctions.js'
import OrbsData from './orbsData.js'
import { deepClone, toDisplayName, toNumberOfDigits } from './utilFunctions.js'
import { bossMod } from './mods/combined.js'
import { floorToZone } from './zones.js'
import LoadoutEffectInstance from './loadoutEffectInstance.js'

const ADJUSTED_DIFFICULTY_PER_ZONE = 2.25

const HP_BASE = 25
const HP_GROWTH = 18
const HP_GROWTH_PCT = 0.11

const POWER_BASE = 10
const POWER_GROWTH = 3
const POWER_GROWTH_PCT = 0.1

const XP_BASE = 50
const XP_GROWTH = 20
const XP_GROWTH_PCT = 0.2
const XP_ZONE_BONUS = 1.75

export function levelToXpReward(lvl){
  const zoneBonuses = Math.floor((lvl - 1) / 10)
  const adjustedLevel = adjustedDifficultyLevel(lvl)
  const val = Math.ceil(geometricProgession(XP_GROWTH_PCT, adjustedLevel - 1, XP_GROWTH))
  return toNumberOfDigits(
    XP_BASE + val * Math.pow(XP_ZONE_BONUS, zoneBonuses),
    3
  )
}

export function monsterLevelToHp(lvl){
  const adjustedLevel = adjustedDifficultyLevel(lvl)
  return toNumberOfDigits(
    HP_BASE + Math.ceil(geometricProgession(HP_GROWTH_PCT, adjustedLevel - 1, HP_GROWTH)),
    2
  )
}

export function monsterLevelToPower(lvl){
  const adjustedLevel = adjustedDifficultyLevel(lvl)
  return toNumberOfDigits(
    POWER_BASE + Math.ceil(geometricProgession(POWER_GROWTH_PCT, adjustedLevel - 1, POWER_GROWTH)),
    2
  )
}

function adjustedDifficultyLevel(lvl){
  const zone = floorToZone(lvl)
  return lvl
    + Math.max(0, zone - 1) * ADJUSTED_DIFFICULTY_PER_ZONE
    + (zone > 20 ? 1 : 0) // scrap-offsetting difficulty jump
}

export default class MonsterInstance extends FighterInstance{

  _monsterData
  _monsterDef
  _itemInstances = []

  constructor(monsterDef, initialState = {}){
    super()

    const baseInfo = Monsters.all[monsterDef.baseType]
    this._monsterData = {
      description: null,
      baseStats: {},
      items: [],
      ...baseInfo,
      ...monsterDef
    }
    this._monsterDef = monsterDef

    for(let i = 0; i < 8; i++){
      if(this.monsterData.items[i]){
        this._itemInstances[i] = new LoadoutEffectInstance({
          obj: this.monsterData.items[i],
          owner: this,
          state: initialState.items?.[i]
        })
      }
    }

    this.setState(initialState)
  }

  get monsterDef(){
    return deepClone(this._monsterDef)
  }

  get monsterData(){
    return deepClone(this._monsterData)
  }

  get isSuper(){
    return this.monsterDef.super ?  true : false
  }

  get description(){
    return this.monsterData.description
  }

  get displayName(){
    return (this.isSuper ? 'SUPER ' : '' ) + (this.monsterDef.displayName ?? toDisplayName(this.monsterData.name))
  }

  get level(){
    return this.monsterData.level ?? 1
  }

  get ItemClass(){
    return MonsterItemInstance
  }

  get baseHp(){
    return monsterLevelToHp(this.level)
  }

  get basePower(){
    return monsterLevelToPower(this.level)
  }

  get baseStats(){
    return [this.monsterData.baseStats] ?? []
  }

  get orbs(){
    return new OrbsData()
  }

  get xpReward(){
    return levelToXpReward(this.level)
  }

  get isBoss(){
    return this.mods.contains(bossMod)
  }

  get rewards(){
    return this.monsterData.rewards ?? {}
  }

  get loadoutEffectInstances(){
    return this._itemInstances.filter(i => i)
  }
}