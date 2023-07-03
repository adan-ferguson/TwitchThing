export default function(combat, actor, abilityInstance, actionDef, damageInfo){
  actionDef = {
    damageType: 'phys',
    pct: 0,
    ...actionDef
  }
  if(!actionDef.returnDamageType){
    actionDef.returnDamageType = actionDef.damageType
  }
  if(damageInfo.damageType !== actionDef.damageType){
    return
  }
  const returnDamage = actionDef.pct * (damageInfo.totalDamage + damageInfo.mitigated)
  if(returnDamage > 0){
    return {
      dealDamage: {
        targets: 'enemy',
        damageType: actionDef.damageType,
        scaling: {
          flat: returnDamage
        }
      }
    }
  }
}