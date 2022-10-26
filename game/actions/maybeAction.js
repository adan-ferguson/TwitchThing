export default function(def){
  if(!def.action){
    throw 'maybeAction missing action'
  }
  return {
    action: null,
    chance: 0.5,
    ...def,
    type: 'maybe'
  }
}