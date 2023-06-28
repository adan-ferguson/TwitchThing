import { lightningStormAbility } from '../../commonTemplates/lightningStormAbility.js'

export default function(){
  return {
    baseStats: {
      physPower: '-50%',
      magicPower: '+75%',
      speed: 20,
      hpMax: '-50%',
      magicDef: '40%',
    },
    items: [
      {
        name: 'Lightning Storm',
        effect: {
          abilities: [{
            ...lightningStormAbility(1),
            uses: 1
          }]
        }
      },
      {
        name: 'Lightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 3000,
            actions: [{
              attack: {
                scaling: {
                  magicPower: 2.5
                },
                damageType: 'magic',
                range: [0, 2]
              }
            }]
          }]
        }
      }
    ]
  }
}