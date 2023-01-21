import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    hpMax: '+30%',
    physPower: '+30%',
    speed: -30
  },
  displayName: 'Two-Headed Shark',
  items: [
    biteMonsterItem(),
    biteMonsterItem({
      name: 'Bite Again'
    })
  ]
}