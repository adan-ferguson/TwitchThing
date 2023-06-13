import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 6 + 4,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.2, level - 1, 0.3),
        magicPower: wrappedPct(geometricProgression(0.2, level, 30, 5)),
        speed: -30 + level * -20
      },
      abilities: [{
        trigger: 'takeTurn',
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 0.05 + 0.05 * level
            }
          }
        }]
      }]
    },
    displayName: 'Angelic Plate Mail'
  }
}