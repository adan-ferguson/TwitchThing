import FighterInstance  from './fighterInstance.js'
import { getMonsterMods, getMonsterStats, monsterLevelToHp, monsterLevelToPower } from './monster.js'
import { toDisplayName } from './utilFunctions.js'
import * as Monsters from './mods/combined.js'

export default class MonsterInstance extends FighterInstance{

  monster

  constructor(monsterDef, initialState = {}){
    super(monsterDef, initialState)

    const baseInfo = Monsters.all[monsterDef.baseType]
    this.monster = {
      description: null,
      baseStats: {},
      abilities: [],
      ...baseInfo,
      ...monsterDef
    }
  }

  get baseHp(){
    return monsterLevelToHp(this.monster.level)
  }

  get basePower(){
    return monsterLevelToPower(this.monster.level)
  }

  get displayName(){
    return this.monster.displayName || toDisplayName(this.monster.name)
  }

  get stats(){
    return getMonsterStats(this.monster, this._currentState)
  }

  get mods(){
    return getMonsterMods(this.monster, this._currentState)
  }

}