import { processAbilityEvents } from './abilities.js'

export function gainHealth(combat, actor, amount){
  const hpBefore = actor.hp
  actor.hp += amount
  const healthGained = actor.hp - hpBefore
  if(healthGained > 0){
    processAbilityEvents(combat, 'gainedHealth', actor, null, {
      healthGained
    })
  }
  return {
    healthGained
  }
}