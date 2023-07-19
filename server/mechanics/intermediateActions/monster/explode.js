export default function(combat, actor, abilityInstance, actionDef, triggerData){

  const attack = {
    attack: {
      damageType: 'magic',
      scaling: actionDef.scaling
    }
  }

  const takeDamage = {
    takeDamage: {
      scaling: {
        hp: 1
      },
      damageType: 'magic',
      ignoreDefense: true
    }
  }

  return [[attack],[takeDamage]]
}