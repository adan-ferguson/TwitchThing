export default function(def){
  return {
    reason: null,
    ...def,
    type: 'cancel'
  }
}