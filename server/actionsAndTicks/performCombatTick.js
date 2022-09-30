import { regen } from './common.js'
import { useEffectAbility } from './performAction.js'

export function performCombatTick(combat, fighterInstance){
  const tickUpdates = []
  tickUpdates.push(regen(fighterInstance))
  fighterInstance.triggeredEffects('tick').forEach(effectInstance => {
    tickUpdates.push(useEffectAbility(combat, effectInstance))
  })
  return tickUpdates.filter(t => t)
}