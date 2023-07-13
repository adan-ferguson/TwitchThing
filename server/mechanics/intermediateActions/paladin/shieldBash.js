import { shieldBashCalcStun } from '../../../../game/commonMechanics/shieldBashCalcStun.js'
import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const actions = [simpleAttackAction('phys', actionDef.physPower)]
  const duration = shieldBashCalcStun(abilityInstance, actionDef)
  if(duration){
    actions.push({
      applyStatusEffect: {
        targets: 'target',
        statusEffect: {
          base: {
            stunned: {
              duration
            }
          },
          diminishingReturns: true,
        }
      }
    })
  }
  return actions
}