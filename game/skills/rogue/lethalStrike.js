import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const physPower = 1.2 + 0.3 * level
  const critDamage = wrappedPct(25 + level * 25)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        turnRefund: 0.5,
        cooldown: 12000,
        exclusiveStats: {
          critDamage
        },
        actions: [{
          attack: {
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}