export default function(combat, actor, subject, abilityInstance, actionDef = {}){
  let count = Math.max(0, actionDef.count ?? Number.MAX_SAFE_INTEGER)
  const removed = []
  for(let sei of subject.statusEffectInstances){
    if(actionDef.polarity && sei.polarity !== actionDef.polarity){
      continue
    }
    sei.expire()
    count--
    removed.push(sei.uniqueID)
    if(!count){
      break
    }
  }
  return { removed }
}
