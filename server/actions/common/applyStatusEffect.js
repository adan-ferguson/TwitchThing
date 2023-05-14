import { gainStatusEffect } from '../../mechanics/gainStatusEffect.js'
import { deepClone } from '../../../game/utilFunctions.js'
import { scaledNumberFromAbilityInstance } from '../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance, actionDef = {}){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const statusEffect = deepClone(actionDef.statusEffect)
  if(statusEffect.Xparams){
    statusEffect.params = extractParams(statusEffect.Xparams, abilityInstance)
    delete statusEffect.Xparams
  }
  const ret = {
    subject: subject.uniqueID,
    statusEffect
  }
  gainStatusEffect(combat, subject, abilityInstance, statusEffect)
  return ret
}

function extractParams(Xparams, abilityInstance){
  const params = {}
  for(let key in Xparams){
    if(key[0] === 'X'){
      params[key.substring(1)] = scaledNumberFromAbilityInstance(abilityInstance, Xparams[key])
    }else{
      params[key] = Xparams[key]
    }
  }
  return params
}