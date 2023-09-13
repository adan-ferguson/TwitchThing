export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const modifiedAbilities = []
  const toMod = subject.effectInstances
    .filter(ei => {
      return true
    })

  toMod
    .slice(0, actionDef.count ?? undefined)
    .forEach(ei => {
      return ei.getAbilities(actionDef.trigger, 'action').forEach(ability => {
        changeCooldown(ability, actionDef.modification.cooldownRemaining ?? {})
        modifiedAbilities.push({ parentEffect: ei.uniqueID })
      })
    })

  return {
    modifiedAbilities
  }
}

function changeCooldown(ability, cdrDef){
  if(cdrDef.flat){
    ability.cooldownRemaining += cdrDef.flat
  }else if(cdrDef.total){
    ability.cooldownRemaining += (cdrDef.total - 1) * ability.cooldown
  }else if(cdrDef.remaining){
    ability.cooldownRemaining += (cdrDef.remaining - 1) * ability.cooldownRemaining
  }
}