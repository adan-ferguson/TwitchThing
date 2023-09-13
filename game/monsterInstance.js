import FighterInstance  from './fighterInstance.js'
import Monsters from './monsters/combined.js'
import { geometricProgression } from './growthFunctions.js'
import OrbsData from './orbsData.js'
import { deepClone, toDisplayName, toNumberOfDigits } from './utilFunctions.js'
import { floorToZone } from './zones.js'
import LoadoutObjectInstance from './loadoutObjectInstance.js'
import MonsterItem from './monsterItem.js'

const ADJUSTED_DIFFICULTY_PER_ZONE = 2
const ADJUSTED_DIFFICULTY_PER_FLOOR_QUADRATIC = 0.002

const STAT_GROWTH_PCT = 0.13

const HP_BASE = 12
const HP_GROWTH = 8

const POWER_BASE = 5
const POWER_GROWTH = 0.8

const XP_BASE = 1
const XP_GROWTH = 1.5
const XP_GROWTH_PCT = 0.08
const XP_ZONE_BONUS = 2

const GOLD_BASE = 2
const GOLD_GROWTH = 1
const GOLD_GROWTH_PCT = 0.02

export function monsterLevelToXpReward(lvl){
  const zoneBonuses = Math.floor((lvl - 1) / 10)
  const val = Math.floor(geometricProgression(XP_GROWTH_PCT, lvl - 1, XP_GROWTH))
  return toNumberOfDigits(
    XP_BASE + val * Math.pow(XP_ZONE_BONUS, zoneBonuses),
    3
  )
}

export function monsterLevelToGoldReward(lvl){
  const geo = geometricProgression(GOLD_GROWTH_PCT, lvl, GOLD_GROWTH)
  return toNumberOfDigits(Math.ceil(GOLD_BASE + geo), 3)
}

export function monsterLevelToHp(lvl){
  const adjustedLevel = adjustedDifficultyLevel(lvl)
  return toNumberOfDigits(
    HP_BASE + Math.ceil(geometricProgression(STAT_GROWTH_PCT, adjustedLevel - 1, HP_GROWTH)),
    2
  )
}

export function monsterLevelToPower(lvl){
  const adjustedLevel = adjustedDifficultyLevel(lvl)
  return toNumberOfDigits(
    POWER_BASE + Math.ceil(geometricProgression(STAT_GROWTH_PCT, adjustedLevel - 1, POWER_GROWTH)),
    2
  )
}

export function adjustedDifficultyLevel(lvl){
  const zone = floorToZone(lvl)
  return lvl + Math.max(0, zone) * ADJUSTED_DIFFICULTY_PER_ZONE + ADJUSTED_DIFFICULTY_PER_FLOOR_QUADRATIC * lvl * lvl
}

export default class MonsterInstance extends FighterInstance{

  _monsterData
  _monsterDef
  _itemInstances = []

  constructor(monsterDef, initialState = {}){
    super()

    const baseInfo = Monsters[monsterDef.baseType]
    this._monsterData = {
      ...baseInfo.def(monsterDef.tier)
    }
    this._monsterDef = monsterDef
    this.state = initialState
  }

  get itemInstances(){
    return this._itemInstances
  }

  get uniqueID(){
    return this.monsterDef._id
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
    return (this.isSuper ? 'SUPER ' : '' ) + (this.monsterData.displayName ?? toDisplayName(this.monsterDef.baseType))
  }

  get level(){
    return this.monsterDef.level ?? 1
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
    return monsterLevelToXpReward(this.level)
  }

  get goldReward(){
    return monsterLevelToGoldReward(this.level)
  }

  get isBoss(){
    return this.monsterDef.boss
  }

  get loadoutEffectInstances(){
    return this._itemInstances.filter(i => i)
  }

  get loadoutState(){
    const stateDef = []
    for(let i = 0; i < 8; i++){
      stateDef[i] = this._itemInstances[i]?.state
    }
    return stateDef
  }

  set loadoutState(stateDef){
    for(let i = 0; i < 8; i++){
      if(this.monsterData.items?.[i]){
        this._itemInstances[i] = new LoadoutObjectInstance({
          obj: new MonsterItem(this.monsterData.items[i]),
          owner: this,
          state: stateDef[i],
          slotInfo: { col: 0, row: i }
        })
      }
    }
  }
}