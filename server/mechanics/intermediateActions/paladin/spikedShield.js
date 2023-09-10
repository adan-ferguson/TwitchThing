export default function(combat, actor, abilityInstance, actionDef, triggerData){

  const blocked = triggerData.damageDistribution
    .reduce((prev, val) => prev + (val.type === 'barrier' ? val.amount : 0), 0)

  const damage = Math.ceil(blocked * actionDef.pctReturn)

  return {
    dealDamage: {
      targets: 'enemy',
      damageType: 'phys',
      scaling: {
        flat: damage
      }
    }
  }
}
