import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    hpMax: '+10%',
    physPower: '+20%',
    speed: -25
  },
  displayName: 'Two-Headed Shark',
  items: [
    biteMonsterItem(),
    biteMonsterItem({
      name: 'Bite Again'
    })
  ]
}