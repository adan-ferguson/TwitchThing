import { barrierAction } from '../../commonTemplates/barrierAction.js'
import { magicAttackItem } from '../../commonTemplates/magicAttackItem.js'

export default function(){
  return {
    baseStats: {
      magicDef: '40%',
      physPower: '-50%',
      magicPower: '+80%',
      hpMax: '-40%',
      speed: -40
    },
    items: [
      magicAttackItem(),
      {
        name: 'EVIL Barrier',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 12000,
            actions: [barrierAction({
              magicPower: 1.7
            }, { name: 'EVIL Barrier' })]
          }]
        }
      },
      {
        name: 'Death Kill Beam',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 20000,
            actions: [{
              attack: {
                damageType: 'magic',
                scaling: {
                  magicPower: 3.5
                }
              }
            }]
          }]
        }
      }
    ]
  }
}