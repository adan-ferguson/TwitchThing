import { performAction, useAbility } from '../mechanics/actions/performAction.js'
import { processAbilityEvents } from '../mechanics/abilities.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  if(!actor.actionReady){
    return []
  }
  const ability = actor.getNextActiveAbility()
  const actionResults = []
  let turnRefund = 0
  if(ability){
    if(!ability.tryUse()){
      throw 'Can not use ability, it is not ready, this should not have been returned from getNextActiveAbility.'
    }
    actionResults.push(...useAbility(combat, ability))
    turnRefund = ability.turnRefund
  }else{
    actionResults.push(performAction(combat, actor, null, basicAttackDef(actor)))
  }
  actor.nextTurn(turnRefund)
  processAbilityEvents(combat, 'takeTurn', actor)
  return actionResults
}

function basicAttackDef(actor){
  return {
    attack: {
      basic: true,
      damageType: actor.basicAttackType,
      scaling: {
        [actor.basicAttackType + 'Power']: 1,
      },
      hits: actor.stats.get('basicAttacks').value
    },
  }
}
