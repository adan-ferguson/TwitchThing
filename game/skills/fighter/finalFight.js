export default function(level){
  const duration = 4000 + level * 1000
  const speed = 25 * level + 75
  return {
    effect: {
      abilities: [{
        trigger: 'dying',
        uses: 1,
        resetAfterCombat: true,
        replacements: {
          cancel: 'No Die!'
        },
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'No Die!',
              mods: [{
                cantDie: true,
              }],
              duration,
              polarity: 'buff',
              stats: {
                speed
              }
            }
          }
        }]
      }]
    }
  }
}