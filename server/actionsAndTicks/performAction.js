import { performAttack } from './attacks.js'
import _ from 'lodash'
import { takeDamage } from './common.js'
import { performRemoveStatusEffectAction, performStatusEffectAction } from './addStatusEffect.js'
import { validateActionResult } from '../../game/actionResult.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  actor.resetTimeSinceLastAction()
  const index = actor.nextActiveItemIndex()
  if(index > -1){
    return useEffectAbility(combat, actor.itemInstances[index], 'active')
  }
  return {
    basicAttack: true,
    owner: actor.uniqueID,
    results: [performAttack(combat, actor)]
  }
}

export function useEffectAbility(combat, effect, eventName){
  const ability = effect.getAbility(eventName)
  if(!ability){
    throw 'Can not use ability, does not exist'
  }
  if(!ability.ready){
    throw 'Can not use ability, it is not ready.'
  }
  if(!ability.meetsConditions){
    throw 'Can nut use ability, conditions not met.'
  }
  if(!effect.owner){
    throw 'Effect has no owner, so hard for its ability to get triggered'
  }
  const results = []
  for(let i = 0; i < ability.actions.length; i++){
    let actionDef = ability.actions[i]
    if(_.isFunction(actionDef)){
      actionDef = actionDef(combat, effect.owner, results)
    }
    const actionResult = doAction(combat, effect.owner, actionDef)
    validateActionResult(actionResult)
    results.push(actionResult)
    if(actionResult.data.failed && !actionDef.continueOnFailure){
      break
    }
  }

  effect.useAbility(eventName)

  return {
    effect: effect.id,
    eventName,
    owner: effect.owner.uniqueID,
    results: results.filter(r => r)
  }
}

/**
 * @param combat
 * @param owner
 * @param actionDef
 * @returns {object}
 */
function doAction(combat, owner, actionDef){
  if(actionDef.type === 'attack'){
    return performAttack(combat, owner, actionDef)
  }else if(actionDef.type === 'takeDamage'){
    return takeDamage(combat, owner, actionDef)
  }else if(actionDef.type === 'statusEffect'){
    return performStatusEffectAction(combat, owner, actionDef)
  }else if(actionDef.type === 'removeStatusEffect'){
    return performRemoveStatusEffectAction(combat, owner, actionDef)
  }
  throw 'Undefined action'
}