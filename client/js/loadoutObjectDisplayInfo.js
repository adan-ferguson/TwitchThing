import AdventurerSkill from '../../game/skills/adventurerSkill.js'
import AdventurerItem from '../../game/adventurerItem.js'
import { attachedSkill, physScaling } from './components/common.js'

export function loadoutObjectDisplayInfo(adventurerLoadoutObject){
  let def
  if(adventurerLoadoutObject instanceof AdventurerSkill){
    def = skillDefs[adventurerLoadoutObject.id]
  }else if(adventurerLoadoutObject instanceof AdventurerItem){
    def = itemDefs[adventurerLoadoutObject.baseItemId]
  }
  return def(adventurerLoadoutObject.vars)
}

const skillDefs = {}
const itemDefs = {
  fighter06: vars => {
    return {
      abilityDescription: `${attachedSkill()} phys damage dealt by attached skill causes the enemy to bleed for ${physScaling(vars.physScaling)} phys damage per second.`
    }
  }
}