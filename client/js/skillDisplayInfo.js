import { attachedItem } from './components/common.js'
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

const skillDefs = {
  fighter02: {
    extraDetails: skill => {
      return `${attachedItem()} Attached item costs ${orb('fighter', -skill.data.vals.orbs)} less`
    }
  },
  fighter03: {
    extraDetails: `${attachedItem()} Attached item must be empty`
  }
}

function orb(cls, count){
  return `<di-orb-entry orb-class="${cls}" orb-used="${count}"></di-orb-entry>`
}