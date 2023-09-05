import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const duration = 4500 + level * 500
  const speed = 25 * level + 25
  const physPower = wrappedPct(25 + level * 25)
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
              statusEffectId: 'finalFight',
              stats: {
                speed,
                physPower,
              }
            }
          }
        }]
      }]
    }
  }
}