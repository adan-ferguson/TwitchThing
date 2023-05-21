import { arrayize } from '../../game/utilFunctions.js'
import { subjectKeyMatchesEffectInstances } from '../../game/subjectFns.js'

export function processAbilityEvents(triggerHandler, eventNames, owner, sourceAbility, data = {}){

  eventNames = arrayize(eventNames)

  for(let eventName of eventNames){
    data = doReplacements(owner, eventName, sourceAbility, data)
  }

  const pendingTriggers = []
  for(let eventName of eventNames){
    pendingTriggers.push(...doTriggers(owner, eventName, sourceAbility, data))
  }

  triggerHandler.addPendingTriggers(pendingTriggers)

  return data
}

function doTriggers(owner, eventName, sourceAbility, data){
  const abilities = getFighterInstanceAbilities(owner, 'action', eventName, sourceAbility, data)
  const pendingTriggers = []
  for(let ability of abilities){
    if(ability.tryUse()){
      pendingTriggers.push({ ability, data })
    }
  }
  return pendingTriggers
}

function doReplacements(owner, eventName, sourceAbility, actionData = {}){
  actionData = JSON.parse(JSON.stringify(actionData))
  const replacementAbilities = getFighterInstanceAbilities(owner, 'replacement', eventName, sourceAbility, actionData)
  for(let replacementAbility of replacementAbilities){
    if(replacementAbility.tryUse()){
      actionData = performReplacement(replacementAbility, actionData)
    }
  }
  return actionData
}

function performReplacement(replacementAbility, actionData){
  return { ...actionData, ...replacementAbility.replacements.dataMerge }
}

export function getFighterInstanceAbilities(fighterInstance, type, eventName, sourceAbility, data){
  return fighterInstance
    .getAbilities(type, eventName)
    .filter(subjectAbility => {
      if(data.combatTime && subjectAbility.trigger.combatTime){
        if(data.combatTime.before >= subjectAbility.trigger.combatTime || subjectAbility.trigger.combatTime < data.combatTime.after){
          return false
        }
      }
      if(sourceAbility && subjectAbility){
        if(!subjectKeyMatchesEffectInstances(sourceAbility.parentEffect, subjectAbility.parentEffect, subjectAbility.conditions.source)){
          return false
        }
      }
      return true
    })
}