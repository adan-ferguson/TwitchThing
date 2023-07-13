import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+25%',
      speed: -25,
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
                  duration: 20000,
                  persisting: true,
                  stacking: 'stack',
                  stackingId: 'seaSerpentFrost',
                  stats: {
                    speed: -50
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