import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(){
  const explode = {
    trigger: 'instant',
    initialCooldown: 5000,
    actions: [{
      fireSpiritExplode: {
        ratio: 4
      }
    }]
  }
  return {
    baseStats: {
      speed: 60,
      hpMax: '-50%',
      physPower: '-50%',
    },
    items: [
      {
        name: 'Summon Fire Spirit',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000,
            abilityId: 'summonFireSpirit',
            actions: [barrierAction({
              magicPower: 2.5
            }, {
              abilities: [explode]
            })]
          }]
        }
      }
    ],
  }
}