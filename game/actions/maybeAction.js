export default function(def){
  return {
    chance: 0.5,
    ...def,
    type: 'maybe'
  }
}