export default function(def){
  return {
    scaling: {},
    target: 'self',
    ...def,
    type: 'gainHealth'
  }
}