import Items from '../../game/items/combined.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { LOADOUT_OBJECT_SCHEMA } from './loadoutObject.js'
import Joi from 'joi'

export function validateAllItems(){
  for(let id in Items){
    try {
      validateItem(id)
    }catch(ex){
      throw `Item "${id}" failed validation: ` + ex
    }
  }
}

function validateItem(baseItemId){
  Joi.assert(Items[baseItemId].def, Joi.object({
    levelFn: Joi.function().required(),
    orbs: Joi.array() //.required()
  }))
  Joi.assert(new AdventurerItem(baseItemId).data, LOADOUT_OBJECT_SCHEMA)
}