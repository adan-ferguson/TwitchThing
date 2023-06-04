import tastyMonsterItem from '../../commonTemplates/tastyMonsterItem.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+40%',
      physPower: '+20%',
      speed: 10
    },
    items: [tastyMonsterItem]
  }
}