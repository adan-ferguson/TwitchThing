import AdventurerSkill from '../../game/skills/adventurerSkill.js'
import AdventurerItem from '../../game/adventurerItem.js'

export function loadoutObjectDisplayInfo(adventurerLoadoutObject){
  let def
  if(adventurerLoadoutObject instanceof AdventurerSkill){
    def = skillDefs[adventurerLoadoutObject.id]
  }else if(adventurerLoadoutObject instanceof AdventurerItem){
    def = itemDefs[adventurerLoadoutObject.baseItemId]
  }
  return def
}

const skillDefs = {}
const itemDefs = {}