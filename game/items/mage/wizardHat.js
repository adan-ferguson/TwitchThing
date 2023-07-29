import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'
import { counterspellAbility } from '../../commonMechanics/counterspellAbility.js'

export default function(level){
  const magicPower = wrappedPct(50 + geometricProgression(0.2, level, 50, 5))
  const magicDef = exponentialPercentage(0.1, level - 1, 0.4)
  const cooldown = 30000 * Math.pow(0.9, level - 1)
  return {
    effect: {
      stats: {
        magicPower,
        magicDef
      },
      abilities: [counterspellAbility(cooldown)]
    },
    orbs: 6 + 6 * level
  }
}