import { attachedItem, orbEntry } from './components/common.js'
import _ from 'lodash'

export function skillDisplayInfo(adventurerSkill){
  const def = { ...(skillDefs[adventurerSkill.id] ?? {}) }
  if(_.isFunction(def.extraDetails)){
    def.extraDetails = def.extraDetails(adventurerSkill)
  }
  return {
    extraDetails: null,
    ...def
  }
}

const skillDefs = {}