import { performAttackAction } from './attacks.js'
import _ from 'lodash'
import { performCancelAction, performGainHealthAction, performRemoveStackAction, takeDamage } from './common.js'
import { performRemoveStatusEffectAction, performStatusEffectAction } from './statusEffects.js'
import { blankActionResult, validateActionResult } from '../../game/actionResult.js'
import { chooseOne } from '../../game/rando.js'
import { noBasicAttackMod } from '../../game/mods/combined.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  const index = actor.nextActiveItemIndex()
  let ability
  if(index > -1){
    ability = useEffectAbility(combat, actor.itemInstances[index], 'active')
  }else if(actor.mods.contains(noBasicAttackMod)){
    ability = {
      basicAttack: true,
      owner: actor.uniqueID,
      results: [performCancelAction(actor, {
        cancelReason: 'Can\'t attack'
      })]
    }
  }else{
    ability = {
      basicAttack: true,
      owner: actor.uniqueID,
      results: []
    }
    for(let i = 0; i < actor.stats.get('attacks').value; i++){
      ability.results.push(performAttackAction(combat, actor))
    }
  }
  actor.nextTurn()
  return ability
}

export function useEffectAbility(combat, effect, eventName){
  const ability = effect.getAbility(eventName)
  if(!ability){
    throw 'Can not use ability, does not exist'
  }
  if(!ability.ready){
    throw 'Can not use ability, it is not ready.'
  }
  if(!effect.owner){
    throw 'Effect has no owner, so hard for its ability to get triggered'
  }
  const results = []
  let cancelled = false
  for(let i = 0; i < ability.actions.length; i++){
    let actionDef = ability.actions[i]
    if(_.isFunction(actionDef)){
      actionDef = actionDef(combat, effect.owner, results)
    }
    const actionResult = doAction(combat, effect, actionDef) ?? {
      type: 'blank',
      subject: effect.owner.uniqueID
    }
    validateActionResult(actionResult)
    results.push(actionResult)
    if(actionResult.cancelled && !actionDef.continueIfCancelled){
      cancelled = true
      break
    }
  }

  effect.useAbility(eventName)

  return {
    effect: effect.effectId,
    eventName,
    cancelled,
    owner: effect.owner.uniqueID,
    results: results.filter(r => r)
  }
}

/**
 * @param combat
 * @param effect
 * @param actionDef
 * @returns {object}
 */
function doAction(combat, effect, actionDef){
  const owner = effect.owner
  const type = _.isString(actionDef) ? actionDef : actionDef.type
  if(type === 'attack'){
    return performAttackAction(combat, owner, actionDef)
  }else if(type === 'takeDamage'){
    return takeDamage(combat, owner, actionDef)
  }else if(type === 'statusEffect'){
    return performStatusEffectAction(combat, effect, actionDef)
  }else if(type === 'removeStatusEffect'){
    return performRemoveStatusEffectAction(combat, owner, actionDef)
  }else if(type === 'random'){
    return doAction(combat, effect, chooseOne(actionDef.choices))
  }else if(type === 'gainHealth'){
    return performGainHealthAction(combat, owner, actionDef)
  }else if(type === 'removeStack'){
    return performRemoveStackAction(combat, owner, effect)
  }else if(type === 'cancel'){
    return performCancelAction(owner, actionDef)
  }else if(type === 'maybe'){
    if(Math.random() <= actionDef.chance){
      return doAction(combat, effect, actionDef.action)
    }else{
      return blankActionResult()
    }
  }
  throw 'Undefined action'
}