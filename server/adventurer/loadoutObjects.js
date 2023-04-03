import { all } from '../../game/items/combined.js'
import { validateObject } from '../validations.js'
import AdventurerItem from '../../game/adventurerItem.js'
import { ADVENTURER_EFFECT_VALIDATION } from '../effect/effects.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'

const SUBJECT_KEYS = ['self', 'attached', 'neighbouring', 'allItems']

const ORB_MODIFIER_VALIDATION = {
  type: {
    all: { type: 'integer' },
    fighter: { type: 'integer' },
    mage: { type: 'integer' },
    paladin: { type: 'integer' },
    rogue: { type: 'integer' },
    chimera: { type: 'integer' },
  }
}

const RESTRICTION_VALIDATION = {
  empty: { type: 'boolean' },
  slot: { type: [0,1,2,3,4,5,6,7] }
}

const LOADOUT_OBJECT_VALIDATION = {
  displayName: { required: true, type: 'string' },
  loadoutModifiers: {
    type: 'object',
    validKeys: SUBJECT_KEYS,
    validValue: {
      type: {
        orbs: { type: ORB_MODIFIER_VALIDATION },
        restrictions: { type: RESTRICTION_VALIDATION }
      }
    }
  },
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
  validateObject(new AdventurerItem(baseItemId).data, LOADOUT_OBJECT_VALIDATION)
}

export function validateAllSkills(){
  for(let id in all){
    try {
      validateSkill(id)
    }catch(ex){
      throw `Skill "${id}" failed validation: ` + ex
    }
  }
}

function validateSkill(id){
  validateObject(new AdventurerSkill(id).data, LOADOUT_OBJECT_VALIDATION)
}