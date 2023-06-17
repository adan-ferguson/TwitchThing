import Items from '../../game/items/combined.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { LOADOUT_OBJECT_SCHEMA } from './loadoutObject.js'
import Joi from 'joi'
import { getAllItemKeys } from '../../game/adventurerClassInfo.js'

export function validateAllItems(){
  for(let id of getAllItemKeys()){
    try {
      validateItem(id)
    }catch(ex){
      throw `Item "${id}" failed validation: ` + ex
    }
  }
}

function validateItem(baseItemId){
  Joi.assert(Items[baseItemId].def, Joi.function())
  Joi.assert(new AdventurerItem(baseItemId).data, LOADOUT_OBJECT_SCHEMA.append({
    orbs: Joi.number().integer().required()
  }))
}