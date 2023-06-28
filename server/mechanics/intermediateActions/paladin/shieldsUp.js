import { blockBarrierAction } from '../../../../game/commonTemplates/blockBarrierAction.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  return blockBarrierAction(actor, actionDef.multiplier)
}