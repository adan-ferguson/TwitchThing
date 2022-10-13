export default function(def){
  return {
    damageType: 'phys',
    damageMulti: 1,
    ...def,
    type: 'attack'
  }
}