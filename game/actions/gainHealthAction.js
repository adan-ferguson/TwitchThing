export default function(def){
  return {
    scaling: {},
    affects: 'self',
    ...def,
    type: 'gainHealth'
  }
}