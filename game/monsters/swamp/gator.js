import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '+40%',
      speed: -40,
      hpMax: '+40%',
      magicDef: '40%'
    },
    items: [
      biteMonsterItem(11000, 1.2)
    ]
  }
}