export default function(def){
  return {
    change: 0,
    setRemaining: 1,
    ...def,
    type: 'turnTime'
  }
}
