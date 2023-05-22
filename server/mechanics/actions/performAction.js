import _ from 'lodash'
import Actions from './combined.js'
import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { arrayize } from '../../../game/utilFunctions.js'
import { processAbilityEvents } from '../abilities.js'

export function performAction(combat, actor, ability, actionDef){
  const expandedActionDef = expandActionDef(actionDef)
  let results = []
  for(let key in expandedActionDef){
    const result = arrayize(Actions[key].def(combat, actor, ability, expandedActionDef[key]))
    results.push(...result)
    if(result.length && result.at(-1).cancelled){
      break
    }
  }
  results.forEach(r => {
    if(!r.subject){
      throw 'Action result missing subject.'
    }
  })
  return {
    actor: actor.uniqueID,
    effect: ability?.parentEffect.uniqueID,
    ability: ability?.index,
    actionDef,
    results,
  }
}

export function useAbility(combat, ability, triggerData = null){
  const owner = ability.fighterInstance
  processAbilityEvents(combat, 'useAbility', owner, ability)
  ability.phantomEffect ? owner.addPhantomEffect(ability.phantomEffect, ability.parentEffect) : null
  const results = []
  iterateActions(ability.actions)
  owner.clearPhantomEffects()
  return results

  function iterateActions(actions){
    for(let i = 0; i < actions.length; i++){
      let actionDef = actions[i]
      if(_.isArray(actionDef)){
        // Decoupled action array, use this to define actions where if one fails, the
        // subsequent ones should still be performed.
        // eg.
        // actions: [[attackDef],[attackDef],[attackDef]] would do all 3 if 1st dodged
        // actions: [attackDef, attackDef, attackDef] would not
        iterateActions(actionDef)
      }else{
        const actionResult = performAction(combat, owner, ability, actionDef)
        results.push(actionResult)
        if(actionResult.cancelled){
          return
        }
      }
    }
  }
}