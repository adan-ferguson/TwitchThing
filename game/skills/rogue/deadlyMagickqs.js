import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const stats = level === 1 ? {} : {
    critChance: (level - 1) * 0.1,
    magicPower: wrappedPct((level - 1) * 30)
  }
  return {
    effect: {
      mods: [{
        magicCrit: true
      }],
      stats
    },
  }
}