import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'

export default function(){
  return {
    baseStats: {
      speed: 30,
      hpMax: '-40%',
      physPower: '-30%'
    },
    items: [flutteringMonsterItem]
  }
}