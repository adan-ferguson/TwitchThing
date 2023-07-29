import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const lower = abilityInstance.totalStats.get('physPower').value <= abilityInstance.totalStats.get('magicPower').value ? 'phys' : 'magic'
  return simpleAttackAction(lower, actionDef.power)
}