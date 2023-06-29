import { processAbilityEvents } from './abilities.js'

export function gainHealth(triggerHandler, actor, amount){
  const hpBefore = actor.hp
  actor.hp += amount * actor.stats.get('healing').value
  const healthGained = actor.hp - hpBefore
  if(healthGained > 0){
    processAbilityEvents(triggerHandler, 'gainedHealth', actor, null, {
      healthGained
    })
  }
  return {
    healthGained
  }
}