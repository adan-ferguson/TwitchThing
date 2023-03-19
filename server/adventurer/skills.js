import { all }  from '../../game/skills/combined.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'
import { validateObject } from '../validations.js'

const LOADOUT_MODIFIER_VALIDATION = {
  slot: { required: true, type: ['attached'] },
  orbs: { type: 'integer' },
  restriction: { type: ['empty'] }
}

const SKILL_VALIDATION = {
  displayName: { required: true, type: 'string' },
  loadoutModifiers: { arrayOf: LOADOUT_MODIFIER_VALIDATION },
  vals: { type: 'object' }
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
  validateObject(new AdventurerSkill(id).data, SKILL_VALIDATION)
}