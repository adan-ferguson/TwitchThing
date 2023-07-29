import tastyMonsterItem from '../../commonMechanics/tastyMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physDef: '50%',
      speed: 10
    },
    items: [
      {
        name: 'Double Pinch',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 7000,
            actions: [{
              attack: {
                hits: 2,
                scaling: {
                  physPower: 1
                }
              }
            }]
          }]
        }
      },
      tastyMonsterItem
    ]
  }
}