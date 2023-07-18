import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const physPower = 1.2 + 0.3 * level
  const critDamage = wrappedPct(50 + 50 * level)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
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