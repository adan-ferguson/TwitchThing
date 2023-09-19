export default function(tier){
  const webShot = {
    name: tier ? 'Webbier Shot' : 'Web Shot',
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 10000,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              base: {
                slowed: {
                  speed: -40 - 60 * tier
                }
              },
              name: 'webbed',
              persisting: false,
              duration: tier ? 0 : 10000,
            }
          }
        }]
      }]
    }
  }

  return {
    baseStats: {
      physPower: '+20%',
      hpMax: '+30%',
      speed: 10 + 40 * tier
    },
    items: [webShot],
  }
}