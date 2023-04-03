import { all } from '../../game/items/combined.js'
import { validateObject } from '../validations.js'
import AdventurerItem from '../../game/adventurerItem.js'
import { ADVENTURER_EFFECT_VALIDATION } from '../effect/effects.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'

const SUBJECT_KEYS = ['self', 'attached', 'neighbouring', 'allItems']
const LOADOUT_RESTRICTION_VALIDATION = {}
const ORB_MODIFIER_VALIDATION = {}

SUBJECT_KEYS.forEach(key => {
  LOADOUT_RESTRICTION_VALIDATION[key] = {
    empty: { type: 'boolean' },
    slot: { type: [0,1,2,3,4,5,6,7] }
  }

  ORB_MODIFIER_VALIDATION[key] = {}
  const orbTypes = ['all','fighter','mage','paladin','rogue','chimera']
  orbTypes.forEach(orbType => {
    ORB_MODIFIER_VALIDATION[key][orbType] = { type: 'integer' }
  })
})

const LOADOUT_OBJECT_VALIDATION = {
  displayName: { required: true, type: 'string' },
  loadoutModifiers: {
    orbs: { type: ORB_MODIFIER_VALIDATION },
    restrictions: { type: LOADOUT_RESTRICTION_VALIDATION }
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