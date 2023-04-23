import _ from 'lodash'
import { validateActionResult } from '../../game/actionResult.js'
import Actions from './combined.js'
import { expandActionDef } from '../../game/actionDefs/expandActionDef.js'
import { arrayize } from '../../game/utilFunctions.js'

export function performAction(combat, actor, effect, actionDef){
  const expandedActionDef = expandActionDef(actionDef)
  let results = Actions[expandedActionDef.type].def(combat, actor, effect, expandedActionDef)
  results = arrayize(results)
  results.forEach(r => {
    if(!r.subject){
      throw 'Action result missing object.'
    }
  })
  return {
    actionDef,
    actorId: actor.uniqueID,
    effectId: effect?.effectId,
    results
  }
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
      if(_.isArray(actionDef)){
        // Decoupled action array, use this to define actions where if one fails, the
        // subsequent ones should still be performed.
        //
        // eg.
        // actions: [[attackDef],[attackDef],[attackDef]] would do all 3 if 1st dodged
        // actions: [attackDef, attackDef, attackDef] would not
        iterateActions(actionDef)
      }else{
        if(_.isFunction(actionDef)){
          actionDef = actionDef({ combat, owner: effect.owner, results, triggerData })
        }
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