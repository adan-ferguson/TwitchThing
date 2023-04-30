import _ from 'lodash'
import Actions from './combined.js'
import { expandActionDef } from '../../game/actionDefs/expandActionDef.js'
import { arrayize } from '../../game/utilFunctions.js'

export function performAction(combat, actor, ability, actionDef){
  const expandedActionDef = expandActionDef(actionDef)
  let results = []
  for(let key in expandedActionDef){
    results.push(...arrayize(Actions[key].def(combat, actor, ability, expandedActionDef[key])))
  }
  results.forEach(r => {
    if(!r.subject){
      throw 'Action result missing object.'
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
  if(!ability.tryUse()){
    throw 'Can not use ability, it is not ready.'
  }
  const owner = ability.fighterInstance
  const results = []
  iterateActions(ability.actions)
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