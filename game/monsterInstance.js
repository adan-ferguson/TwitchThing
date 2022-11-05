import FighterInstance  from './fighterInstance.js'
import * as Monsters from './monsters/combined.js'
import MonsterItemInstance from './monsterItemInstance.js'
import { exponentialValueCumulative } from './exponentialValue.js'
import OrbsData from './orbsData.js'
import { toDisplayName, toNumberOfDigits } from './utilFunctions.js'
import { bossMod } from './mods/combined.js'

const HP_BASE = 30
const HP_GROWTH = 8
const HP_GROWTH_PCT = 0.17

const POWER_BASE = 10
const POWER_GROWTH = 2
const POWER_GROWTH_PCT = 0.15

const XP_BASE = 25
const XP_GROWTH = 25
const XP_GROWTH_PCT = 0.25
const XP_ZONE_BONUS = 2.5

const GOLD_BASE = 10
const GOLD_GROWTH = 5
const GOLD_GROWTH_PCT = 0.12

const BOSS_XP_BONUS = 5
const BOSS_GOLD_BONUS = 5

export function levelToXpReward(lvl){
  const zoneBonuses = Math.floor((lvl - 1) / 10)
  const val = Math.ceil(exponentialValueCumulative(lvl - 1, XP_GROWTH_PCT) * XP_GROWTH * Math.pow(XP_ZONE_BONUS, zoneBonuses))
  return toNumberOfDigits(
    XP_BASE + val,
    2
  )
}

function levelToGoldReward(lvl){
  return toNumberOfDigits(
    GOLD_BASE + Math.ceil(exponentialValueCumulative(lvl - 1, GOLD_GROWTH_PCT) * GOLD_GROWTH),
    2
  )
}

export function monsterLevelToHp(lvl){
  return toNumberOfDigits(
    HP_BASE + Math.ceil(exponentialValueCumulative(HP_GROWTH_PCT, lvl - 1, HP_GROWTH)),
    2
  )
}

export function monsterLevelToPower(lvl){
  return toNumberOfDigits(
    POWER_BASE + Math.ceil(exponentialValueCumulative(POWER_GROWTH_PCT, lvl - 1, POWER_GROWTH)),
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
    const bonus = this.mods.contains(bossMod) ? BOSS_XP_BONUS : 1
    return levelToXpReward(this.level) * bonus * XP_BASE
  }

  get goldReward(){
    const bonus = this.mods.contains(bossMod) ? BOSS_GOLD_BONUS : 1
    return levelToGoldReward(this.level) * bonus * GOLD_BASE
  }
}