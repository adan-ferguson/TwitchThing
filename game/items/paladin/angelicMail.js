import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 5 + 5,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.2, level - 1, 0.3),
        magicPower: wrappedPct(20 + geometricProgression(0.25, level, 30, 5)),
      },
      abilities: [{
        trigger: 'takeTurn',
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 0.05 + 0.15 * level
            }
          }
        }]
      }]
    },
    displayName: 'Angelic Plate Mail'
  }
}