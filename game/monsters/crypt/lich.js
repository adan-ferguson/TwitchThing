import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(){
  return {
    baseStats: {
      magicDef: '40%',
      physPower: '-50%',
      magicPower: '+80%',
      hpMax: '-40%',
      speed: -60
    },
    items: [
      {
        name: 'Magic Attack',
        effect: {
          mods: [{
            magicAttack: true
          }]
        }
      },
      {
        name: 'EVIL Barrier',
        effect: {
          abilities: [{
            tags: ['spell'],
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
            tags: ['spell'],
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