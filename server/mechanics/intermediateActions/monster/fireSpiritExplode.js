export default function(combat, actor, abilityInstance, actionDef){
  const damage = abilityInstance.parentEffect.barrierHp * actionDef.ratio
  return [{
    attack: {
      damageType: 'magic',
      scaling: {
        flat: damage
      }
    }
  },{
    modifyStatusEffect: {
      subject: {
        key: 'self'
      },
      modification: {
        remove: true
      }
    }
  }]
}