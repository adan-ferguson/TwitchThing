export default function(level){
  const cooldown = 30000 + level * 15000
  const clones = 1 + level * 1
  const chance = 0.5
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown,
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'illusion',
              stacking: 'stack',
              persisting: true,
              polarity: 'buff',
              abilities: [{
                trigger: 'targeted',
                conditions: {
                  random: chance
                },
                uses: clones,
                abilityId: 'saplingBlock',
                replacements: {
                  cancel: 'fooled'
                }
              }],
              vars: {
                clones,
                chance
              },
            }
          }
        }]
      }]
    }
  }
}