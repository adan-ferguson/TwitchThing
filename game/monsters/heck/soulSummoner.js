import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(tier){
  const time = 5000
  const ratio = 4
  const explode = {
    trigger: 'instant',
    initialCooldown: time,
    actions: [{
      fireSpiritExplode: {
        ratio
      }
    }]
  }
  return {
    baseStats: {
      speed: 60,
      hpMax: '-50%',
      physPower: '-60%',
      magicPower: '+110%',
    },
    items: [
      {
        name: 'Summon Fire Spirit',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000 - tier * 3000,
            actions: [barrierAction({
              magicPower: 2.50
            }, {
              name: 'fireSpirit',
              stacking: null,
              abilities: [explode],
            })]
          }],
        }
      }
    ],
  }
}