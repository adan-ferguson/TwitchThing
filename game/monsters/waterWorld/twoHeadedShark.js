import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    hpMax: '+50%',
    physPower: '+30%',
    speed: -20
  },
  displayName: 'Two-Headed Shark',
  items: [
    biteMonsterItem(),
    biteMonsterItem({
      name: 'Bite Again'
    })
  ]
}