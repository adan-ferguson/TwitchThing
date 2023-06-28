import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+10%',
      physPower: '+10%',
      speed: 30
    },
    displayName: 'Two-Headed Shark',
    items: [
      biteMonsterItem(5000, 1.4, {
        cooldown: 15000
      }), {
        ...biteMonsterItem(10000, 1.4, {
          cooldown: 15000,
        }),
        name: 'Bite Again'
      }
    ]
  }
}