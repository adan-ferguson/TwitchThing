export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  const hits = target.statusEffectInstances.filter(sei => sei.polarity === 'buff').length
  if(!hits){
    return null
  }
  return {
    attack: {
      targets: 'target',
      hits,
      damageType: 'magic',
      scaling: {
        magicPower: actionDef.magicPower
      }
    }
  }
}