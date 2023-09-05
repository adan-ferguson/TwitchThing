import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(20 + geometricProgression(0.10, level-1, 15, 1)),
      }
    },
    displayName: 'Short Sword',
    orbs: level * 1
  }
}