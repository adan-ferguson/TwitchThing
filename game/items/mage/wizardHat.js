import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'
import { counterspellAbility } from '../../commonTemplates/counterspellAbility.js'

export default function(level){
  const magicPower = wrappedPct(30 + geometricProgression(0.2, level, 30, 5))
  const magicDef = exponentialPercentage(0.1, level - 1, 0.3)
  const cooldown = 20000 * Math.pow(0.9, level - 1)
  return {
    effect: {
      stats: {
        magicPower,
        magicDef
      },
      abilities: [counterspellAbility(cooldown)]
    },
    orbs: 7 + 5 * level
  }
}