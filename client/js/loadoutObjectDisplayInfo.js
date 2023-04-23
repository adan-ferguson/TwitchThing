import AdventurerSkill from '../../game/skills/adventurerSkill.js'
import AdventurerItem from '../../game/adventurerItem.js'
import { attachedSkill, physScaling } from './components/common.js'
import MonsterItem from '../../game/monsterItem.js'

export function loadoutObjectDisplayInfo(loadoutObject){
  let def
  if(loadoutObject instanceof AdventurerSkill){
    def = skillDefs[loadoutObject.id]
  }else if(loadoutObject instanceof AdventurerItem){
    def = itemDefs[loadoutObject.baseItemId]
  }else if(loadoutObject instanceof MonsterItem){
    def = monsterItemDefs[loadoutObject.name]
  }
  return def ? def(loadoutObject.data?.vars) : {}
}

const skillDefs = {}
const itemDefs = {
  fighter06: vars => {
    return {
      abilityDescription: `${attachedSkill()} Phys damage dealt by attached skill causes the enemy to bleed for ${physScaling(vars.physScaling)} phys damage per second.`
    }
  }
}

const monsterItemDefs = {
  fluttering: () => {
    return {
      abilityDescription: 'Automatically dodge an attack.'
    }
  }
}