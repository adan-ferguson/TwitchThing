import { triggerEvent } from './common.js'

export function performCombatTick(combat, fighterInstance){
  const tickUpdates = []
  tickUpdates.push(...triggerEvent(combat, fighterInstance, 'tick'))
  return tickUpdates.filter(t => t)
}