export default function(combat, attacker, effect = null, actionDef = {}){
  effect.removeStack()
  return makeActionResult({
    type: 'removeStack',
    subject: owner.uniqueID
  })
}