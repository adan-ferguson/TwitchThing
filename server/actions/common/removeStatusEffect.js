export default function(combat, attacker, effect = null, actionDef = {}){
  // const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  // const resultObj = {
  //   type: 'removeEffect',
  //   triggeredEvents: [],
  //   subject: subject.uniqueID
  // }
  //
  // if(subject !== actor){
  //   resultObj.triggeredEvents.push(...triggerEvent(combat, subject, 'targeted'))
  //   if(resultObj.triggeredEvents.at(-1)?.cancelled){
  //     resultObj.cancelled = true
  //     return makeActionResult(resultObj)
  //   }
  // }
  //
  // const candidateEffects = subject.statusEffectsData.instances.filter(sei => {
  //   return sei.isBuff === actionDef.isBuff && !sei.expired && !sei.phantom
  // })
  //
  // let sliceVal = undefined
  // if(actionDef.count !== 'all'){
  //   if(actionDef.order === 'newest'){
  //     sliceVal = actionDef.count * -1
  //   }else if (actionDef.order === 'oldest'){
  //     sliceVal = actionDef.count
  //   }
  // }
  // const toRemove = candidateEffects.slice(sliceVal)
  // subject.statusEffectsData.remove(toRemove)
  // resultObj.data = {
  //   removed: toRemove.map(instance => instance.id)
  // }
  //
  // return makeActionResult(resultObj)
}