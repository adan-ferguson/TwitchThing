export default function(def){
  return {
    scaledPower: 0,
    pct: 0,
    flat: 0,
    ...def,
    type: 'gainHealth'
  }
}