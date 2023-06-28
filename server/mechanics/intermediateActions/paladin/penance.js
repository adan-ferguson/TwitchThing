export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  if(!target){
    return
  }
  const damage = Math.ceil(triggerData.healthGained * actionDef.pct)
  return {
    dealDamage: {
      damageType: 'magic',
      scaling: {
        flat: damage
      }
    }
  }
}
