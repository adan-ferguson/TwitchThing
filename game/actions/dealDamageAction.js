export default function(def){
  return {
    affects: 'enemy',
    damageType: 'phys',
    scaling: {},
    range: null,
    ignoreDefense: false,
    ...def,
    type: 'dealDamage'
  }
}
