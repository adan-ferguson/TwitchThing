import { subjectKeyMatchesEffectInstances } from '../../../../game/subjectFns.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const modifiedEffects = []
  const mod = actionDef.modification
  const toMod = subject.statusEffectInstances
    .filter(sei => {
      const s = actionDef.subject
      if(s.name && s.name !== sei.name){
        return false
      }
      if(s.key && !subjectKeyMatchesEffectInstances(abilityInstance?.parentEffect, sei, s.key)){
        return false
      }
      if(s.polarity && sei.polarity !== s.polarity){
        return false
      }
      return true
    })

  toMod
    .slice(0, actionDef.count ?? undefined)
    .forEach(sei => {
      if(mod.stacks){
        sei.modifyStacks(mod.stacks)
      }
      if(mod.remove){
        sei.expire()
      }
      modifiedEffects.push(sei.uniqueID)
    })

  return {
    modifiedEffects
  }
}