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
        ability.cooldownRemaining += actionDef.modification.cooldownRemaining ?? 0
        modifiedAbilities.push({ parentEffect: ei.uniqueID })
      })
    })

  return {
    modifiedAbilities
  }
}