import { darkArmorOfDoomEffect } from '../../commonMechanics/effects/darkArmorOfDoomEffect.js'

export default function(tier){

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

  const items = [
    {
      name: 'Cursed Strike',
      effect: {
        abilities: [
          {
            trigger: 'active',
            initialCooldown: 8000 - tier * 2500,
            actions: [removeBuff, {
              attack: {
                scaling: {
                  physPower: 1.5
                },
              }
            }]
          }
        ]
      }
    },
  ]

  if(tier){
    items.push(
      {
        name: 'Dark Armor',
        effect: darkArmorOfDoomEffect(5)
      }
    )
  }

  return {
    baseStats: {
      physPower: '+5%',
      physDef: '+20%',
      speed: -15,
      hpMax: '+20%'
    },
    items
  }
}