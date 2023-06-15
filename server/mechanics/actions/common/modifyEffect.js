export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const modifiedEffects = []
  subject.effectInstances
    .filter(ei => actionDef.name && ei.name === actionDef.name)
    .forEach(ei => {
      if(actionDef.modification.addStacks){
        ei.addStack?.(actionDef.modification.addStacks)
      }
      modifiedEffects.push(ei.uniqueID)
    })
  return {
    modifiedEffects
  }
}