import { processAbilityEvents } from './abilities.js'

export function gainHealth(triggerHandler, actor, amount){
  if(actor.dead){
    return
  }
  const hpBefore = actor.hp
  const toGain = Math.round(amount * actor.stats.get('healing').value)
  actor.hp += toGain
  const healthGained = actor.hp - hpBefore
  if(healthGained > 0){
    processAbilityEvents(triggerHandler, 'gainedHealth', actor, null, {
      healthGained,
      overheal: Math.max(0, toGain - healthGained),
      total: toGain,
    })
  }
  return {
    healthGained
  }
}