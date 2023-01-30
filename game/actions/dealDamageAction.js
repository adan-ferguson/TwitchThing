export default function(def){
  return {
    affects: 'enemy',
    damageType: 'phys',
    scaling: {},
    ignoreDefense: false,
    ...def,
    type: 'dealDamage'
  }
}
