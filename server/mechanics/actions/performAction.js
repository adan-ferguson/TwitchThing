import _ from 'lodash'
import Actions from './combined.js'
import IntermediateActions from '../intermediateActions/combined.js'
import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { arrayize } from '../../../game/utilFunctions.js'
import { processAbilityEvents } from '../abilities.js'
import DungeonRunInstance from '../../dungeons/dungeonRunInstance.js'

export function performAction(triggerHandler, actor, ability, actionDef, triggerData = {}){
  const key = Object.keys(actionDef)[0]
  const expandedActionDef = expandActionDef(actionDef)?.[key]
  if(!expandedActionDef){
    // It's an intermediate action
    return performIntermediateAction(...arguments)
  }

  return {
    actor: actor.uniqueID,
    effect: ability?.parentEffect.uniqueID,
    ability: ability?.index,
    actionDef: { [key]: expandedActionDef },
    results: getResults()
  }

  function getResults(){
    const targets = getTargets()
    const allResults = []
    targets.forEach(target => {
      const results = arrayize(performIt(target))
      allResults.push(...arrayize(results).map(r => {
        if(actor !== target && r.cancelled){
          processAbilityEvents(triggerHandler, 'thwart', target, null, expandedActionDef)
        }
        return {
          ...r,
          subject: target.uniqueID
        }
      }))
    })
    return allResults
  }

  function performIt(target){
    if(target !== actor){
      const targetResult = processAbilityEvents(triggerHandler, 'targeted', target, ability)
      if(targetResult.cancelled){
        return {
          cancelled: targetResult.cancelled
        }
      }
    }
    if(!Actions[key]){
      debugger
    }
    return Actions[key].def(triggerHandler, actor, target, ability, expandedActionDef, triggerData)
  }

  function getTargets(){
    const targets = expandedActionDef.targets
    if(!targets || targets === 'self'){
      return [actor]
    }else if(triggerHandler instanceof DungeonRunInstance){
      return []
    }else if(targets === 'all'){
      return triggerHandler.fighters
    }else if(triggerHandler.getEnemyOf){
      return [triggerHandler.getEnemyOf(actor)]
    }
  }
}

export function performIntermediateAction(triggerHandler, actor, ability, actionDef, triggerData){
  const key = Object.keys(actionDef)[0]
  const actionDefs = arrayize(IntermediateActions[key].def(triggerHandler, actor, ability, actionDef[key], triggerData))
  if(!actionDefs.length){
    return performAction(triggerHandler, actor, ability, { pass: {} }, triggerData)
  }
  return actionDefs.map(ad => {
    return performAction(triggerHandler, actor, ability, ad, triggerData)
  })
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
        const actionResult = performAction(combat, owner, ability, actionDef, triggerData)
        results.push(actionResult)
        if(actionResult.cancelled){
          return
        }
      }
    }
  }
}