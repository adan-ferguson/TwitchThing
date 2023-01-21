export default function(def){
  return {
    amountFlat: 0,
    amountPct: 0,
    excludeSelf: false,
    ...def,
    type: 'refreshCooldowns'
  }
}