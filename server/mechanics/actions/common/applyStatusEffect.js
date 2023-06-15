import { gainStatusEffect } from '../../gainStatusEffect.js'

export default function(combat, actor, subject, abilityInstance, actionDef = {}){
  return gainStatusEffect(combat, actor, subject, abilityInstance, actionDef)
}