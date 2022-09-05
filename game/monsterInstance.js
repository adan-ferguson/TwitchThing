import FighterInstance  from './fighterInstance.js'
import { getMonsterMods, getMonsterStats, monsterLevelToHp, monsterLevelToPower } from './monster.js'
import * as Monsters from './monsters/combined.js'
import MonsterItemInstance from './monsterItemInstance.js'

export default class MonsterInstance extends FighterInstance{

  monster

  constructor(monsterDef, initialState = {}){
    super(monsterDef, initialState)

    const baseInfo = Monsters.all[monsterDef.baseType]
    this.monster = {
      description: null,
      baseStats: {},
      items: [],
      ...baseInfo,
      ...monsterDef
    }
  }

  get uniqueID(){
    return this.monster._id
  }

  get level(){
    return this.monster.level ?? 1
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
    return getMonsterStats(this.monster)
  }

  get mods(){
    return getMonsterMods(this.monster)
  }


  get itemInstances(){
    return this.adventurer.items.map((item, index) => {
      if(item){
        return new MonsterItemInstance(item, this._currentState.itemStates[index])
      }
      return null
    })
  }


}