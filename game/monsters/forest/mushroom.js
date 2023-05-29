const statusEffect = function(def){
  return {
    applyStatusEffect: {
      targets: 'enemy',
      statusEffect: {
        polarity: 'debuff',
        persisting: true,
        stacking: 'stack',
        duration: 10000,
        ...def
      }
    }
  }
}

const burningSpores = statusEffect({
  base: {
    damageOverTime: {
      damage: {
        scaledNumber: {
          magicPower: 0.06
        }
      }
    }
  },
  name: 'burningSpores',
})

const slowingSpores = statusEffect({
  name: 'slowingSpores',
  stats: {
    speed: -25
  }
})

const shrinkingSpores = statusEffect({
  name: 'slowingSpores',
  stats: {
    physPower: '-20%',
    hpMax: '-20%'
  }
})

const sleepSpores = statusEffect({
  name: 'sleepingSpores',
  stacking: 'replace',
  mods: [{
    freezeActionBar: true
  }],
  duration: 5000
})

const options = [
  { weight: 30, value: burningSpores },
  { weight: 20, value: slowingSpores },
  { weight: 5, value: sleepSpores },
  { weight: 5, value: shrinkingSpores },
]

export default function(){
  return {
    baseStats: {
      hpMax: '+80%',
      physPower: '-80%',
      magicPower: '+20%'
    },
    items: [
      {
        name: 'Passive',
        effect: {
          mods: [{
            freezeActionBar: true
          }]
        }
      },
      {
        name: 'Regeneration',
        effect: {
          abilities: [{
            trigger: { instant: true },
            initialCooldown: 5000,
            actions: [{
              gainHealth: {
                scaling: {
                  magicPower: 0.4
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Spores',
        effect: {
          abilities: [{
            trigger: { hitByAttack: true },
            abilityId: 'mushroomSpores',
            actions: [{
              random: {
                options
              }
            }]
          }]
        }
      }
    ]
  }
}