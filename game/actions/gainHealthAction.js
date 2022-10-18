export default function(def){
  return {
    // scaledAmount: 0,
    pct: 0,
    ...def,
    type: 'gainHealth'
  }
}