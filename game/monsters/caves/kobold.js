import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'

export default function(tier){

  const items = tier ? [{
    name: 'Flame Slash',
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 4000,
        actions: [
          simpleAttackAction('phys'),
          simpleAttackAction('magic')
        ]
      }]
    }
  }] : []

  return {
    baseStats: {
      hpMax: '+30%',
      speed: 20 + tier * 130,
    },
    items,
  }
}