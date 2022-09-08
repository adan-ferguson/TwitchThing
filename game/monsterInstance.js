import FighterInstance  from './fighterInstance.js'
import * as Monsters from './monsters/combined.js'
import MonsterItemInstance from './monsterItemInstance.js'
import scaledValue from './scaledValue.js'
import Stats from './stats/stats.js'
import ModsCollection from './modsCollection.js'
import OrbsData from './orbsData.js'

const REWARD_MULTIPLIER = 0.17
const POWER_MULTIPLIER = 0.19
const HP_MULTIPLIER = 0.21

const HP_BASE = 40
const XP_BASE = 50
const POWER_BASE = 10

export function getScalingValue(lvl, multiplier){
  lvl = lvl - 1
  const zones = Math.floor(lvl / 10)
  const iterations = lvl + zones
  return scaledValue(multiplier, iterations)
}

export function levelToXpReward(lvl){
  return Math.ceil(getScalingValue(lvl, REWARD_MULTIPLIER) * XP_BASE)
}

export function monsterLevelToHp(lvl){
  return Math.ceil(getScalingValue(lvl, HP_MULTIPLIER) * HP_BASE)
}

export function monsterLevelToPower(lvl){
  return Math.ceil(getScalingValue(lvl, POWER_MULTIPLIER) * POWER_BASE)
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

  get stats(){
    const loadoutStatAffectors = this.itemInstances
      .filter(s => s)
      .map(ii => ii.stats)
    loadoutStatAffectors.push(this._fighterData.baseStats ?? {})
    return new Stats(loadoutStatAffectors)
  }

  get mods(){
    const loadoutMods = this.itemInstances
      .filter(m => m)
      .map(ii => ii.mods)
    const stateMods = []
    return new ModsCollection(...loadoutMods, ...stateMods)
  }

  get orbs(){
    return new OrbsData()
  }
}