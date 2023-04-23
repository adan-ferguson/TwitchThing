import { arrayize } from '../../game/utilFunctions.js'

export function processAbilityEvents(triggerHandler, eventNames, owner, data = {}){

  eventNames = arrayize(eventNames)

  for(let eventName of eventNames){
    data = doReplacements(owner, eventName, data)
  }

  const pendingTriggers = []
  for(let eventName of eventNames){
    pendingTriggers.push(...doTriggers(owner, eventName, data))
  }

  triggerHandler.addPendingTriggers(pendingTriggers)

  return data
}

function doTriggers(owner, eventName, data, combat = null){
  const abilities = getFighterInstanceAbilities(owner, 'action', eventName)
  const pendingTriggers = []
  for(let ability of abilities){
    // TODO: check if conditions met, ability is ready
    if(ability.tryUse()){
      pendingTriggers.push({ ability, data })
    }
  }
  return pendingTriggers
}

function doReplacements(owner, eventName, actionData = {}){
  actionData = JSON.parse(JSON.stringify(actionData))
  const replacementAbilities = getFighterInstanceAbilities(owner, 'replacement', eventName)
  for(let replacementAbility of replacementAbilities){
    // TODO: check if conditions met, ability is ready
    if(replacementAbility.tryUse()){
      actionData = performReplacement(replacementAbility, actionData)
    }
  }
  return actionData
}

function performReplacement(replacementAbility, actionData){
  return { ...actionData, ...replacementAbility.abilityDef.dataMerge }
}

function getFighterInstanceAbilities(fighterInstance, type, eventName){
  const abilities = []
  fighterInstance.effectInstances.forEach(effectInstance => {
    abilities.push(...getEffectInstanceAbilities(effectInstance, type, eventName))
  })
  return abilities
}

export function getEffectInstanceAbilities(effectInstance, type, actionKey){
  return effectInstance.abilities.filter(ai => {
    if(ai.type !== type || ai.actionKey !== actionKey){
      return false
    }
    return true
  })
}

// refreshCooldowns(def = null){
//   const pct = def ? def.amountPct : 1
//   const flat = def ? def.amountFlat : 0
//   for(let key in this.instances){
//     this.instances[key].cooldownRemaining -= flat
//     this.instances[key].cooldownRemaining *= (1 - pct)
//   }
// }