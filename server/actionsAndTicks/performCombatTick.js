import { regen, triggerEvent } from './common.js'

export function performCombatTick(combat, fighterInstance){
  const tickUpdates = []
  tickUpdates.push(regen(fighterInstance))
  tickUpdates.push(...triggerEvent(combat, fighterInstance, 'tick'))
  return tickUpdates.filter(t => t)
}