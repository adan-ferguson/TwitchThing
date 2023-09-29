import { toPct } from '../../utilFunctions.js'

export default function(tier){
  const uses = 3 + tier * 17
  return {
    baseStats: {
      speed: -120,
      hpMax: toPct(1.4 + tier * 4),
      physPower: toPct(0.6 + tier * 0.2)
    },
    items: [{
      name: tier ? 'Sprout Way Too Many Saplings' : 'Sprout Saplings',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          abilityId: 'sproutSaplings',
          uses: 1,
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'Sapling',
                polarity: 'buff',
                statusEffectId: 'sproutSaplings',
                abilities: [{
                  trigger: 'attacked',
                  uses,
                  abilityId: 'saplingBlock',
                  replacements: {
                    cancel: 'absorbed'
                  }
                }],
                vars: {
                  uses
                }
              }
            }
          }]
        }]
      }
    }]
  }
}