import { flutteringAbility } from '../../commonMechanics/flutteringMonsterItem.js'

export default function(level){
  const cooldown = 20000 * Math.pow(0.9, level - 1)
  const ret = {
    effect: {
      abilities: [
        flutteringAbility(cooldown)
      ],
    },
    orbs: level * 3 + 2
  }
  if(level > 1){
    ret.effect.stats = { speed: ( level - 1 ) * 10 }
  }
  return ret
}