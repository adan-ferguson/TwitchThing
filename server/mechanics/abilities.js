import { arrayize } from '../../game/utilFunctions.js'
import { subjectKeyMatchesEffectInstances } from '../../game/subjectFns.js'

export function processAbilityEvents(triggerHandler, eventNames, owner, sourceAbility, data = {}){

  eventNames = arrayize(eventNames)

  const pendingTriggers = []
  for(let eventName of eventNames){
    const abilities = getFighterInstanceAbilities(owner, eventName, sourceAbility, data)
    for(let ability of abilities){
      if(ability.tryUse()){
        data = performReplacement(ability.replacements, data)
        if(ability.actions){
          pendingTriggers.push({ ability, data })
        }
      }
    }
  }

  triggerHandler.addPendingTriggers(pendingTriggers)

  return data
}

function performReplacement(replacementAbility, actionData){
  return { ...actionData, ...(replacementAbility.dataMerge ?? {}) }
}

export function getFighterInstanceAbilities(fighterInstance, type, sourceAbility, data){
  return fighterInstance
    .getAbilities(type)
    .filter(subjectAbility => {
      if(data.combatTime && subjectAbility.trigger.combatTime){
        if(data.combatTime.before >= subjectAbility.trigger.combatTime || subjectAbility.trigger.combatTime < data.combatTime.after){
          return false
        }
      }
      if(sourceAbility && subjectAbility){
        if(!subjectKeyMatchesEffectInstances(subjectAbility.parentEffect, sourceAbility.parentEffect, subjectAbility.conditions?.source)){
          return false
        }
      }
      if(subjectAbility.conditions?.attackDodgeable && data.undodgeable){
        return false
      }
      return true
    })
}