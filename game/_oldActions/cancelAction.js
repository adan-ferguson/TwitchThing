export default function(def){
  return {
    cancelReason: null,
    ...def,
    type: 'cancel'
  }
}