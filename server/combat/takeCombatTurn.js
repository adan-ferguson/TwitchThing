import { performAction, useAbility } from '../mechanics/actions/performAction.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  if(!actor.actionReady){
    return []
  }
  const ability = actor.getNextActiveAbility()
  const actionResults = []
  if(ability){
    if(!ability.tryUse()){
      throw 'Can not use ability, it is not ready, this should not have been returnd from getNextActiveAbility.'
    }
    actionResults.push(...useAbility(combat, ability))
  }else if(actor.hasMod('noBasicAttack')){
    actionResults.push(performAction(combat, actor, null, {
      type: 'idle',
      reason: 'Can\'t attack',
    }))
  }else{
    for(let i = 0; i < actor.stats.get('basicAttacks').value; i++){
      actionResults.push(performAction(combat, actor, null, basicAttackDef(actor)))
    }
  }
  actor.nextTurn()
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
    },
  }
}
