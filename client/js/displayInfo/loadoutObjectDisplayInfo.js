import AdventurerSkill from '../../../game/skills/adventurerSkill.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import { attachedSkill } from '../components/common.js'
import LoadoutObjectInstance from '../../../game/loadoutObjectInstance.js'
import MonsterItem from '../../../game/monsterItem.js'

export function loadoutObjectDisplayInfo(loadoutObject){

  debugger
  const obj = loadoutObject instanceof  LoadoutObjectInstance ? loadoutObject.obj : loadoutObject

  let def
  if(obj instanceof AdventurerSkill){
    def = skillDefs[obj.id]
  }else if(obj instanceof AdventurerItem){
    def = itemDefs[obj.baseItemId]
  }else if(obj instanceof MonsterItem){
    def = monsterItemDefs[obj.name]
  }

  // loadoutObject.data?.vars
  return def ? def({}) : {}
}

const skillDefs = {}
const itemDefs = {}
const monsterItemDefs = {}