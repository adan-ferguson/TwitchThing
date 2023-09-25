import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.25 + tier * 0.6),
      speed: -25 + tier * 50,
      magicDef: '+25%'
    },
    items: [
      flutteringMonsterItem,
      {
        name: 'Frost Breath',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            actions: [{
              attack: {
                damageType: 'magic',
                scaling: {
                  magicPower: 2
                }
              }
            },{
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  name: 'frosty',
                  polarity: 'debuff',
                  duration: 30000,
                  persisting: true,
                  stacking: 'stack',
                  stackingId: 'seaSerpentFrost',
                  stats: {
                    speed: tier ? -250 : -50
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}