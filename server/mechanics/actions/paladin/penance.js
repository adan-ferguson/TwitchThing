import { dealDamage } from '../../dealDamage.js'

export default function(combat, actor, subject, abilityInstance, actionDef, triggerData){
  if(subject){
    const damage = Math.ceil(triggerData.healthGained * actionDef.pct)
    return {
      damageInfo: dealDamage(combat, actor, subject,{
        damageType: 'magic',
        damage
      })
    }
  }
}
