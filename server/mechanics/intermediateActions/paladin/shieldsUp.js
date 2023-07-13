import { blockBarrierAction } from '../../../../game/commonMechanics/blockBarrierAction.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  return blockBarrierAction(actor, actionDef.multiplier)
}