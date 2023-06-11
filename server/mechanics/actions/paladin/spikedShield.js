import { dealDamage } from '../../dealDamage.js'

export default function(combat, actor, subject, abilityInstance, actionDef, triggerData){

  const blocked = triggerData.damageDistribution
    .reduce((prev, val) => prev + (val.name === 'block' ? val.amount : 0), 0)

  const damage = blocked * actionDef.pctReturn

  return dealDamage(combat, actor, subject,{
    damageType: 'phys',
    damage
  })
}
