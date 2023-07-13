import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'
import { terribleCurses } from '../../../../game/commonMechanics/terribleCurses.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  if(!target.hasStatusEffect({ tag: 'terribleCurse' })){
    return {
      random: {
        options: terribleCurses()
      }
    }
  }
  return simpleAttackAction('magic', 1)
}