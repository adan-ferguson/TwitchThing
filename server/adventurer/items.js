import { all } from '../../game/items/combined.js'
import { validateObject } from '../validations.js'
import AdventurerItem from '../../game/adventurerItem.js'
import { ADVENTURER_EFFECT_VALIDATION } from '../effect/effects.js'

const LOADOUT_MODIFIER_VALIDATION = {
  slot: { required: true, type: ['attached'] },
  restriction: { type: ['empty'] }
}

const ITEM_VALIDATION = {
  displayName: { required: true, type: 'string' },
  loadoutModifiers: { arrayOf: LOADOUT_MODIFIER_VALIDATION },
  vals: { type: 'object' },
  effect: { type: ADVENTURER_EFFECT_VALIDATION }
}

export function validateAllItems(){
  for(let id in all){
    try {
      validateItem(id)
    }catch(ex){
      throw `Skill "${id}" failed validation: ` + ex
    }
  }
}

function validateItem(baseItemId){
  validateObject(new AdventurerItem(baseItemId).data, ITEM_VALIDATION)
}