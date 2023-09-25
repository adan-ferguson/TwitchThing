import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: toPct(-0.2 + tier * 0.4),
      hpMax: '-10%',
      speed: 30,
    },
    items: [{
      name: 'Raging',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'No Die!',
                mods: [{
                  cantDie: true,
                }],
                statusEffectId: 'noDie',
                duration: 10000,
                polarity: 'buff',
              }
            }
          }]
        }]
      }
    }]
  }
}