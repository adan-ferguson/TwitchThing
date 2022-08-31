import { regen } from './common.js'

export function performCombatTick(combat, fighterInstance){
  const tickUpdates = []
  if(combat.time % 5000 === 0){
    tickUpdates.push(regen(fighterInstance))
  }
  return tickUpdates.filter(t => t)
}