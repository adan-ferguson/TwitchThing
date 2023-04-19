import Skills from '../../game/skills/combined.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'
import Joi from 'joi'
import { LOADOUT_OBJECT_SCHEMA } from './loadoutObject.js'

export function validateAllSkills(){
  for(let id in Skills){
    try {
      validateSkill(id)
    }catch(ex){
      throw `Skill "${id}" failed validation: ` + ex
    }
  }
}

function validateSkill(id){
  Joi.assert(Skills[id].def, Joi.object({
    levelFn: Joi.function().required(),
    skillPoints: Joi.array()
  }))
  Joi.assert(new AdventurerSkill(id).data, LOADOUT_OBJECT_SCHEMA)
}