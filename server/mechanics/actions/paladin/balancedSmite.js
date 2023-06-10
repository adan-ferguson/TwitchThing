import { expandActionDef } from '../../../../game/actionDefs/expandActionDef.js'
import attack from '../common/attack.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){

  const lower = abilityInstance.totalStats.get('physPower').value <= abilityInstance.totalStats.get('magicPower').value ? 'phys' : 'magic'

  const attackDef = expandActionDef({
    attack: {
      damageType: lower,
      scaling: {
        // LOL
        [lower + 'Power']: actionDef.power
      }
    }
  }).attack

  return attack(combat, actor, subject, abilityInstance, attackDef)
}