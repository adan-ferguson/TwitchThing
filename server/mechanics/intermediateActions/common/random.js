import { chooseMulti } from '../../../../game/rando.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  return chooseMulti(actionDef.options, actionDef.count ?? 1)
}