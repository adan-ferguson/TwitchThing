export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const modifiedEffects = []
  subject.effectInstances
    .filter(ei => actionDef.name && ei.name === actionDef.name)
    .forEach(ei => {
      if(actionDef.modification.stacks){
        ei.modifyStacks?.(actionDef.modification.stacks)
      }
      modifiedEffects.push(ei.uniqueID)
    })
  return {
    modifiedEffects
  }
}