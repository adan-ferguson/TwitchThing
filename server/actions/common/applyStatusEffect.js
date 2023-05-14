import { gainStatusEffect } from '../../mechanics/gainStatusEffect.js'
import { deepClone } from '../../../game/utilFunctions.js'
import { scaledNumberFromAbilityInstance } from '../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance, actionDef = {}){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const statusEffect = deepClone(actionDef.statusEffect)
  if(statusEffect.$params){
    statusEffect.params = extractParams(statusEffect.$params, abilityInstance)
    delete statusEffect.$params
  }
  const ret = {
    subject: subject.uniqueID,
    statusEffect
  }
  gainStatusEffect(combat, subject, abilityInstance, statusEffect)
  return ret
}

function extractParams($params, abilityInstance){
  const params = {}
  for(let key in $params){
    if(key[0] === '$'){
      params[key.substring(1)] = scaledNumberFromAbilityInstance(abilityInstance, $params[key])
    }else{
      params[key] = $params[key]
    }
  }
  return params
}