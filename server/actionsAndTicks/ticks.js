import { triggerEvent } from './common.js'

export function performCombatTicks(combat, fighterInstance){
  const tickUpdates = []
  tickUpdates.push(...triggerEvent(combat, fighterInstance, 'tick'))
  return tickUpdates.filter(t => t)
}

export function performVenturingTicks(fighterInstance, amount){
  const tickUpdates = []
  tickUpdates.push(...triggerEvent(null, fighterInstance, 'tick'))
  return tickUpdates.filter(t => t)
}