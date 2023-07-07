import { flutteringAbility } from '../../commonTemplates/flutteringMonsterItem.js'

export default function(level){
  const cooldown = 20000 * Math.pow(0.9, level - 1)
  return {
    effect: {
      abilities: [
        flutteringAbility(cooldown)
      ],
      stats: {
        speed: 10 + level * 10
      }
    },
    orbs: level * 2 + 3
  }
}