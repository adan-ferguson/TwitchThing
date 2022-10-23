export default function(def){
  return {
    damageType: 'phys',
    damage: 0,
    damagePct: 0,
    ...def,
    type: 'takeDamage'
  }
}