export default function(){
  return {
    baseStats: {
      physPower: '+120%',
      physDef: '+30%',
      speed: -30,
      hpMax: '+120%'
    },
    items: [
      {
        name: 'Screech',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 30000,
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  statusEffectId: 'feared',
                  duration: 15000,
                  mods: [{
                    noBasicAttack: true
                  }],
                  name: 'Feared'
                }
              }
            }]
          }]
        }
      }
    ]
  }
}