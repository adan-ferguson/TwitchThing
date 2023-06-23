import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const power = roundToFixed(0.5 + level * 0.3, 1)

  const physAttack = {
    attack: {
      damageType: 'phys',
      scaling: {
        physPower: power,
      }
    }
  }

  const magicAttack = {
    attack: {
      damageType: 'magic',
      scaling: {
        magicPower: power,
      }
    }
  }

  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 9000,
        actions: [[physAttack], [magicAttack]]
      }]
    }
  }
}