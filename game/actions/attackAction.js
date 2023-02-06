import { cleanupObject } from '../utilFunctions.js'

export default function(def){
  return cleanupObject({
    damageType: 'phys',
    damageMulti: 1,
    damageRange: null,
    damageScaling: 'auto',
    targetHpPct: 0,
    targetMaxHpPct: 0,
    extraCritChance: 0,
    extraCritDamage: 0,
    ...def,
    type: 'attack'
  })
}