import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '+40%',
      speed: -40,
      hpMax: '+40%',
    },
    items: [
      {
        name: 'Resilient Hide',
        effect: {
          stats: {
            damageCeiling: 0.2
          }
        }
      },
      biteMonsterItem(11000, 1.2)
    ]
  }
}