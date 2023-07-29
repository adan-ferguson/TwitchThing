const SPROUT_HEAD_ACTION = (i = 5) => {
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
          initialCooldown: (i + 1) * 1000,
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

export default function(){
  return {
    baseStats: {
      hpMax: '-70%',
      physPower: '-70%',
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
            actions: new Array(6).fill(0).map((_, i) => SPROUT_HEAD_ACTION(i))
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
            uses: 6,
            initialCooldown: 5000,
            actions: [SPROUT_HEAD_ACTION(),SPROUT_HEAD_ACTION()]
          }]
        }
      }
    ]
  }
}