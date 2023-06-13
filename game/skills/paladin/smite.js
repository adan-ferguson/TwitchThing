import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const power = roundToFixed(0.5 + level * 0.3, 1)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 9000,
        actions: [{
          attack: {
            damageType: 'phys',
            scaling: {
              physPower: power,
            }
          }
        },{
          attack: {
            damageType: 'magic',
            scaling: {
              magicPower: power,
            }
          }
        }]
      }]
    }
  }
}