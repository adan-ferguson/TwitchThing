// Returns an abilityDef, which performs the given action when you hit with an
// active ability attack from the same source effect. This replaces "onHit" property.
import { arrayize } from '../utilFunctions.js'

export function onHit(action){
  return {
    trigger: 'attackHit',
    conditions: {
      source: {
        subjectKey: 'self',
        trigger: 'active'
      }
    },
    actions: arrayize(action)
  }
}