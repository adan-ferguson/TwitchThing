import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const hits = 1 + level * 2
  const physPower = Math.max(0.01, roundToFixed(1.5 / hits, 2))
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 12000,
        actions: [{
          attack: {
            hits,
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}