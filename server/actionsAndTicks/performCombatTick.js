import { regen } from './common.js'

export function performCombatTick(combat, fighterInstance){
  const tickUpdates = []
  tickUpdates.push(regen(fighterInstance))
  return tickUpdates.filter(t => t)
}