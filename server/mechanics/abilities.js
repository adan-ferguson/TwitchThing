import { arrayize } from '../../game/utilFunctions.js'
import { subjectKeyMatchesEffectInstances } from '../../game/subjectFns.js'
import _ from 'lodash'

export function processAbilityEvents(triggerHandler, eventNames, owner, sourceAbility, data = {}){

  eventNames = arrayize(eventNames)

  const pendingTriggers = []
  for(let eventName of eventNames){
    const abilities = getFighterInstanceAbilities(triggerHandler, owner, eventName, sourceAbility, data)
    for(let ability of abilities){
      if(ability.tryUse()){
        data = performReplacement(ability, data)
        if(ability.actions){
          pendingTriggers.push({ ability, data })
        }
      }
    }
  }

  triggerHandler.addPendingTriggers(pendingTriggers)

  return data
}

function performReplacement(replacerAbility, actionData){
  const replacements = replacerAbility.replacements
  const replacedData = { ...actionData, ...(replacements.dataMerge ?? {}) }
  if(replacements.cancel){
    replacedData.cancelled = {
      cancelledByEffect: replacerAbility.parentEffect.uniqueID,
      cancelledByFighter: replacerAbility.fighterInstance.uniqueID,
      reason: replacements.cancel
    }
  }
  return replacedData
}

export function getFighterInstanceAbilities(triggerHandler, fighterInstance, type, sourceAbility, data){
  return fighterInstance
    .getAbilities(type)
    .filter(subjectAbility => {
      if(subjectAbility.conditions){
        return conditionsMatch(triggerHandler, subjectAbility.conditions, sourceAbility, subjectAbility, data)
      }
      return true
    })
}

function conditionsMatch(triggerHandler, conditions, sourceAbility, subjectAbility, data){
  if(conditions.source?.subjectKey && sourceAbility && subjectAbility){
    if(!subjectKeyMatchesEffectInstances(subjectAbility.parentEffect, sourceAbility.parentEffect, conditions.source.subjectKey)){
      return false
    }
  }
  if(conditions.source?.hasTag && !sourceAbility.tags.includes(conditions.source.hasTag)){
    return false
  }
  if(conditions.data){
    for(let key in conditions.data){
      if(conditions.data[key] !== data[key]){
        return
      }
    }
  }
  if(conditions.owner && !subjectAbility.fighterInstance.meetsConditions(conditions.owner)){
    return false
  }
  if(conditions.random && Math.random() > conditions.random){
    return false
  }
  return true
}