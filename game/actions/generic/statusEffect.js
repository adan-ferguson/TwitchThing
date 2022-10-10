export default function(def){
  if(!def.effect){
    throw 'effect not provided to statusEffect action, probably a bug'
  }
  return {
    affects: 'self',
    effect: null,
    ...def,
    type: 'statusEffect'
  }
}