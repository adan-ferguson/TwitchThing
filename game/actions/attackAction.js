export default function(def){
  return {
    damageType: 'phys',
    damageMulti: 1,
    damageScaling: 'auto',
    targetHpPct: 0,
    targetMaxHpPct: 0,
    ...def,
    type: 'attack'
  }
}