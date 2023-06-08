import _ from 'lodash'
import Actions from './combined.js'
import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { arrayize } from '../../../game/utilFunctions.js'
import { processAbilityEvents } from '../abilities.js'
import { chooseOne } from '../../../game/rando.js'

export function performAction(combat, actor, ability, actionDef){
  const key = Object.keys(actionDef)[0]
  const expandedActionDef = expandActionDef(actionDef)[key]
  if(key === 'random'){
    const randomDef = chooseOne(expandedActionDef.options)
    return performAction(combat, actor, ability, randomDef)
  }else if(key === 'maybe'){
    if(expandedActionDef.chance < Math.random()){
      return {
        actor: actor.uniqueID,
        effect: ability?.parentEffect.uniqueID,
        ability: ability?.index,
        actionDef: { [key]: expandedActionDef },
        results: []
      }
    }else{
      return performAction(combat, actor, ability, expandedActionDef.action)
    }
  }
  return {
    actor: actor.uniqueID,
    effect: ability?.parentEffect.uniqueID,
    ability: ability?.index,
    actionDef: { [key]: expandedActionDef },
    results: getResults()
  }

  function getResults(){
    const target = getTarget()
    const results = arrayize(performIt(target))
    return arrayize(results).map(r => {
      return {
        ...r,
        subject: target.uniqueID
      }
    })
  }

  function performIt(target){
    if(target !== actor){
      const targetResult = processAbilityEvents(combat, 'targeted', target, ability)
      if(targetResult.cancelled){
        return {
          cancelled: targetResult.cancelled
        }
      }
    }
    return Actions[key].def(combat, actor, target, ability, expandedActionDef)
  }

  function getTarget(){
    return (!expandedActionDef.targets || expandedActionDef.targets === 'self') ? actor : combat.getEnemyOf(actor)
  }
}

export function useAbility(combat, ability, triggerData = {}){
  const owner = ability.fighterInstance
  triggerData = processAbilityEvents(combat, 'useAbility', owner, ability, triggerData)

  if(combat.getEnemyOf){
    triggerData = processAbilityEvents(combat, 'enemyUseAbility', combat.getEnemyOf(owner), ability, triggerData)
  }

  if(triggerData.cancelled){
    return [{
      actor: owner.uniqueID,
      effect: ability?.parentEffect.uniqueID,
      ability: ability?.index,
      actionDef: { cancelled: true },
      results: [{
        subject: triggerData.cancelled.cancelledByFighter,
        cancelled: triggerData.cancelled
      }]
    }]
  }

  ability.phantomEffect ? owner.addPhantomEffect(ability.phantomEffect, ability.parentEffect) : null
  const results = []

  for(let i = 0; i < ability.repetitions; i++){
    iterateActions(ability.actions)
  }

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