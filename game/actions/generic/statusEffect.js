export default function(def){
  if(!def.effect && !def.base){
    throw 'effect or base not provided to statusEffect action, probably a bug'
  }
  const effect = def.effect ?? {}
  if(def.base){
    effect.name = def.base.name
  }
  return {
    affects: 'self',
    effect,
    ...def,
    type: 'statusEffect'
  }
}