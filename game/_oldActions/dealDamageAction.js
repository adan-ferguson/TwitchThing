export default function(def){
  return {
    target: 'enemy',
    damageType: 'phys',
    scaling: {},
    range: null,
    ignoreDefense: false,
    ...def,
    type: 'dealDamage'
  }
}
