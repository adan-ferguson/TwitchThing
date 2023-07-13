import { spikedShieldCalcStun } from '../../../../game/commonMechanics/spikedShieldCalcStun.js'
import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const actions = [simpleAttackAction('physPower', actionDef.physPower)]
  const duration = spikedShieldCalcStun(abilityInstance, actionDef)
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