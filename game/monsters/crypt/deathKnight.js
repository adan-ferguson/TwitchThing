import { onHit } from '../../commonTemplates/onHit.js'

export default function(){

  const removeBuff = {
    modifyStatusEffect: {
      targets: 'target',
      subject: {
        polarity: 'buff'
      },
      modification: {
        remove: true
      }
    }
  }

  return {
    baseStats: {
      physPower: '+5%',
      physDef: '+20%',
      speed: -15,
      hpMax: '+20%'
    },
    items: [
      {
        name: 'Cursed Strike',
        effect: {
          abilities: [
            {
              trigger: 'active',
              initialCooldown: 8000,
              actions: [removeBuff, {
                attack: {
                  scaling: {
                    physPower: 1.7
                  },
                }
              }]
            }
          ]
        }
      }
    ]
  }
}