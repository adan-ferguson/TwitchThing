import Monsters from '../../game/monsters/combined.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'
import { MONSTER_ITEM_SCHEMA } from './monsterItem.js'

const MONSTER_SCHEMA = Joi.object({
  baseStats: STATS_SCHEMA,
  items: Joi.array().items(MONSTER_ITEM_SCHEMA)
})

export function validateAllMonsters(){
  for(let id in Monsters){
    try {
      validateMonster(id)
    }catch(ex){
      throw `Monster "${id}" failed validation: ` + ex.message
    }
  }
}

function validateMonster(id){
  Joi.assert(Monsters[id].def, MONSTER_SCHEMA)
}