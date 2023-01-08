import FighterInstance  from './fighterInstance.js'
import * as Monsters from './monsters/combined.js'
import MonsterItemInstance from './monsterItemInstance.js'
import { geometricProgession } from './growthFunctions.js'
import OrbsData from './orbsData.js'
import { toDisplayName, toNumberOfDigits } from './utilFunctions.js'
import { bossMod } from './mods/combined.js'

const HP_BASE = 25
const HP_GROWTH = 20
const HP_GROWTH_PCT = 0.2 //0.25

const POWER_BASE = 10
const POWER_GROWTH = 4
const POWER_GROWTH_PCT = 0.2 //0.25

const XP_BASE = 50
const XP_GROWTH = 25
const XP_GROWTH_PCT = 0.25
const XP_ZONE_BONUS = 3

export function levelToXpReward(lvl){
  const zoneBonuses = Math.floor((lvl - 1) / 10)
  const val = Math.ceil(geometricProgession(XP_GROWTH_PCT, lvl - 1, XP_GROWTH * Math.pow(XP_ZONE_BONUS, zoneBonuses), 3))
  return toNumberOfDigits(
    XP_BASE + val,
    2
  )
}

export function monsterLevelToHp(lvl){
  return toNumberOfDigits(
    HP_BASE + Math.ceil(geometricProgession(HP_GROWTH_PCT, lvl - 1, HP_GROWTH)),
    2
  )
}

export function monsterLevelToPower(lvl){
  return toNumberOfDigits(
    POWER_BASE + Math.ceil(geometricProgession(POWER_GROWTH_PCT, lvl - 1, POWER_GROWTH)),
    2
  )
}

export default class MonsterInstance extends FighterInstance{

  monsterDef

  constructor(monsterDef, initialState = {}){

    const baseInfo = Monsters.all[monsterDef.baseType]
    const monsterData = {
      description: null,
      baseStats: {},
      items: [],
      ...baseInfo,
      ...monsterDef
    }

    super(monsterData, initialState)
    this.monsterDef = monsterDef
  }

  get description(){
    return this.fighterData.description
  }

  get displayName(){
    return this.monsterDef.displayName ?? toDisplayName(this.fighterData.name)
  }

  get uniqueID(){
    return this.monsterDef._id
  }

  get level(){
    return this._fighterData.level ?? 1
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
    return [this._fighterData.baseStats] ?? []
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
    return this._fighterData.rewards ?? {}
  }
}