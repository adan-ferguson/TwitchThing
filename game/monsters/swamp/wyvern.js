import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'

export default function(){
  return {
    baseStats: {
      magicDef: '+20%',
      speed: 20,
      physPower: '-20%',
      magicPower: '-20%',
      hpMax: '-10%'
    },
    items: [
      flutteringMonsterItem,
      {
        name: 'Acid Breath',
        effect: {
          abilities: [
            {
              trigger: 'active',
              uses: 1,
              abilityId: 'acidBreath',
              actions: [{
                attack: {
                  damageType: 'magic',
                  scaling: {
                    magicPower: 2
                  },
                }
              },{
                breakItem: {
                  count: 2
                }
              }]
            }
          ]
        }
      }
    ]
  }
}