export function attackAction(def){
  return {
    type: 'attack',
    damageType: 'phys',
    ...def
  }
}