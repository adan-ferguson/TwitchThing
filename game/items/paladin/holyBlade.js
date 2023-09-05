import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pct = wrappedPct(20 + geometricProgression(0.10, level, 20, 5))
  return {
    orbs: level * 2 + 2,
    effect: {
      stats: {
        physPower: pct,
        magicPower: pct
      }
    }
  }
}