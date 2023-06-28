import { chooseOne } from '../../../../game/rando.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  return chooseOne(actionDef.options)
}