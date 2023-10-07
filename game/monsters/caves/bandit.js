import { pocketSandAbility } from '../../commonMechanics/pocketSandAbility.js'

export default function(tier){

  const items = [
    {
      name: 'Ambush',
      effect: {
        mods: [{
          sneakAttack: true
        }]
      }
    }
  ]

  if(tier > 0){
    items.push({
      name: 'Lvl. 5 Pocket Sand',
      effect: {
        abilities: [
          pocketSandAbility(5)
        ]
      },
    })
  }

  return {
    baseStats: {
      speed: 5 + tier * 50,
      hpMax: '-20%',
      physPower: '+10%'
    },
    items,
  }
}