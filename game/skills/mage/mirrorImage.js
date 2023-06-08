export default function(level){
  const cooldown = 15000 + level * 15000
  const clones = 1 + level * 1
  const chance = clones / (clones + 1)
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown,
        abilityId: 'mirrorImage',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'Illusion',
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
              }]
            }
          }
        }],
        vars: {
          clones,
          chance
        }
      }]
    }
  }
}