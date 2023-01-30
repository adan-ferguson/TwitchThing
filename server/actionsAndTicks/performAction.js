import { performAttackAction, performDealDamageAction, performTakeDamageAction } from './attacks.js'
import _ from 'lodash'
import {
  performCancelAction,
  performGainHealthAction, performParentEffectAction, performRefreshCooldownsAction,
  performRemoveStackAction,
  performTurnTimeAction
} from './common.js'
import { performRemoveStatusEffectAction, performStatusEffectAction } from './statusEffects.js'
import { blankActionResult, validateActionResult } from '../../game/actionResult.js'
import { chooseOne } from '../../game/rando.js'
import { noBasicAttackMod } from '../../game/mods/combined.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  const index = actor.nextActiveItemIndex()
  const abilities = []
  if(index > -1){
    const item = actor.itemInstances[index]
    abilities.push(useEffectAbility(combat, item, 'active'))
    // TODO: don't hardcode, this can be some sort of triggered ability
    // if(actor.mods.contains(doubleStrikeMod) && index === 0){
    //   if(actor.itemInstances[1]?.getAbility('active')?.ready){
    //     abilities.push(useEffectAbility(combat, actor.itemInstances[1], 'active'))
    //   }
    // }
  }else if(actor.mods.contains(noBasicAttackMod)){
    abilities.push({
      basicAttack: true,
      owner: actor.uniqueID,
      results: [performCancelAction(actor, {
        cancelReason: 'Can\'t attack'
      })]
    })
  }else{
    for(let i = 0; i < actor.stats.get('attacks').value; i++){
      abilities.push({
        basicAttack: true,
        owner: actor.uniqueID,
        results: [performAttackAction(combat, actor, null, {
          damageType: 'auto'
        })]
      })
    }
  }
  actor.nextTurn()
  return abilities
}

export function useEffectAbility(combat, effect, eventName, triggerData = null){
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
  iterateActions(ability.actions)

  effect.useAbility(eventName)

  return {
    effect: effect.effectId,
    eventName,
    cancelled,
    owner: effect.owner.uniqueID,
    results: results.filter(r => r)
  }

  function iterateActions(actions){
    for(let i = 0; i < actions.length; i++){
      let actionDef = actions[i]
      if(_.isFunction(actionDef)){
        actionDef = actionDef({ combat, owner: effect.owner, results, triggerData })
      }else if(_.isArray(actionDef)){
        // Decoupled action array, use this to define actions where if one fails, the
        // subsequent ones should still be performed.
        //
        // eg.
        // actions: [[attackDef],[attackDef],[attackDef]] would do all 3 if 1st dodged
        // actions: [attackDef, attackDef, attackDef] would not
        iterateActions(actionDef)
      }else{
        const actionResult = doAction(combat, effect, actionDef) ?? {
          type: 'blank',
          subject: effect.owner.uniqueID
        }
        validateActionResult(actionResult)
        results.push(actionResult)
        if(actionResult.cancelled){
          cancelled = true
          return
        }
      }
    }
  }
}

/**
 * @param combat
 * @param effect
 * @param actionDef
 * @returns {object}
 */
function doAction(combat, effect, actionDef){
  if(!actionDef){
    return null // Blank
  }
  const owner = effect.owner
  const type = _.isString(actionDef) ? actionDef : actionDef.type
  if(type === 'attack'){
    return performAttackAction(combat, owner, effect, actionDef)
  }else if(type === 'dealDamage'){
    return performDealDamageAction(combat, owner, actionDef)
  }else if(type === 'takeDamage'){
    return performTakeDamageAction(combat, owner, actionDef)
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
    if(Math.random() > actionDef.chance){
      return performCancelAction(owner)
    }else{
      return blankActionResult()
    }
  }else if(type === 'turnTime'){
    return performTurnTimeAction(combat, owner, actionDef)
  }else if(type === 'parentEffectAction'){
    return performParentEffectAction(combat, effect, actionDef)
  }else if(type === 'refreshCooldowns'){
    return performRefreshCooldownsAction(combat, owner, effect, actionDef)
  }
  throw 'Undefined action'
}