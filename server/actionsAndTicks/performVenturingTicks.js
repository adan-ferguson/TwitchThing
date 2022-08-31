import { regen } from './common.js'

export function performVenturingTicks(fighterInstance, amount){
  const tickUpdates = []
  for(let i = 0; i < amount; i++){
    const updates = []
    updates.push(regen(fighterInstance))
    tickUpdates[i] = updates.filter(t => t)
  }
  return tickUpdates
}