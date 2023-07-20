import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(){
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
            cooldown: 6000,
            actions: [barrierAction({
              magicPower: 2.51
            }, {
              name: 'fireSpirit',
              abilities: [explode],
            })]
          }],
        }
      }
    ],
  }
}