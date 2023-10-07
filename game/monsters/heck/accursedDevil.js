import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '-10%',
      speed: 40,
      physPower: '-40%',
      magicPower: toPct(1.1 + tier * 0.9)
    },
    items: [
      {
        name: 'TERRIBLE Curse',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              terribleCurse: {
                attackScaling: 1,
                count: tier ? 2 : 1,
              }
            }]
          }]
        }
      }
    ],
    displayName: 'Demoted Lucifer'
  }
}