const statusEffect = function(def){
  return {
    applyStatusEffect: {
      targets: 'enemy',
      statusEffect: {
        polarity: 'debuff',
        persisting: true,
        stacking: 'stack',
        stackingId: 'mushroom_' + def.name,
        duration: 10000,
        ...def
      }
    }
  }
}

const burningSpores = statusEffect({
  base: {
    damageOverTime: {
      damageType: 'magic',
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
  base: { slowed: { speed: -25 } }
})

const shrinkingSpores = statusEffect({
  name: 'shrinkingSpores',
  stats: {
    physPower: '-20%',
    hpMax: '-20%'
  }
})

const stunSpores = statusEffect({
  base: { stunned: { duration: 5000 } },
  name: 'stunSpores',
})

const options = [
  { weight: 30, value: burningSpores },
  { weight: 15, value: slowingSpores },
  { weight: 5, value: stunSpores },
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
            trigger: 'instant',
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
            trigger: 'hitByAttack',
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