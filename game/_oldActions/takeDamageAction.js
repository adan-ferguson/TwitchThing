export default function(def){
  return {
    damageType: 'phys',
    scaling: {},
    ignoreDefense: false,
    ...def,
    type: 'takeDamage'
  }
}
