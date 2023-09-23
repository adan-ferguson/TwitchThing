import { toPct } from '../../utilFunctions.js'

const SPROUT_HEAD_ACTION = (offset = 1) => {
  return {
    applyStatusEffect: {
      targets: 'self',
      statusEffect: {
        name: 'Hydra Head',
        base: {
          barrier: {
            hp: {
              scaledNumber: {
                hpMax: 1
              }
            }
          }
        },
        stacking: null,
        abilities: [{
          trigger: 'instant',
          initialCooldown: 6000 * offset,
          cooldown: 6000,
          actions: [{
            attack: {
              scaling: {
                physPower: 1
              }
            }
          }]
        }]
      }
    }
  }
}

export default function(tier){

  const heads = 6 + tier * 2
  return {
    baseStats: {
      hpMax: toPct(-0.6 + tier * 0.5),
      physPower: toPct(-0.6 + tier * 0.1),
      speed: -100
    },
    items: [
      {
        name: 'Multi-Headed',
        effect: {
          abilities: [{
            abilityId: 'hydraMultiHeaded',
            trigger: 'startOfCombat',
            uses: 1,
            actions: new Array(heads).fill(0).map((_, i) => SPROUT_HEAD_ACTION(i/heads))
          }],
          mods: [{
            freezeActionBar: true
          }]
        }
      },
      {
        name: 'Sprout Heads',
        effect: {
          abilities: [{
            abilityId: 'hydraSproutHead',
            trigger: 'instant',
            uses: 6 + tier * 6,
            initialCooldown: tier ? 2500 : 5000,
            actions: [SPROUT_HEAD_ACTION(),SPROUT_HEAD_ACTION()]
          }]
        }
      }
    ]
  }
}