import { exponentialPercentage, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const magicPower = wrappedPct(30 + level * 20)
  const magicDef = exponentialPercentage(0.1, level - 1, 0.3)
  const cooldown = 30000 * Math.pow(0.9, level - 1)
  return {
    effect: {
      stats: {
        magicPower,
        magicDef
      },
      abilities: [{
        trigger: {
          targeted: {
            triggerType: 'active',
            hasTag: 'magic'
          }
        },
        cooldown,
        replacements: {
          cancel: 'countered'
        }
      }]
    },
    orbs: 4 + 8 * level
  }
}