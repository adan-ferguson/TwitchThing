import flutteringMonsterItem from '../../commonTemplates/flutteringMonsterItem.js'
import { onHit } from '../../commonTemplates/onHit.js'

export default function(){
  return {
    baseStats: {
      magicDef: '+30%',
      speed: 20,
      physPower: '+10%',
      magicPower: '+10%',
      hpMax: '+30%'
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
              }]
            },
            onHit({
              breakItem: {
                count: 2
              }
            })]
        }
      }
    ]
  }
}