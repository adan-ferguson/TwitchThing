import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      hpMax: '-20%',
      speed: 45
    },
    items: [
      biteMonsterItem(4000, 1.4, {
        cooldown: 16000
      }), {
        ...biteMonsterItem(8000, 1.4, {
          cooldown: 16000,
        }),
        name: 'Bite Again'
      }, {
        ...biteMonsterItem(12000, 1.4, {
          cooldown: 16000,
        }),
        name: 'Bite Yet Again'
      }
    ]
  }
}