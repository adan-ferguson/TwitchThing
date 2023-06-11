import { exponentialPercentage, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 7 + 4,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.30),
        magicPower: wrappedPct(30 * level),
        speed: -20 + level * -30
      },
      abilities: [{
        trigger: 'takeTurn',
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 0.1 + 0.1 * level
            }
          }
        }]
      }]
    },
    displayName: 'Angelic Plate Mail'
  }
}