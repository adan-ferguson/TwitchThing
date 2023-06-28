import { lightningStormAbility } from '../../commonTemplates/lightningStormAbility.js'

export default function(level){
  const duration = 12000 + level * 6000
  const cooldown = 45000 + level * 15000
  const magicPower = 1.4 + level * 0.6
  return {
    effect: {
      abilities: [
        lightningStormAbility(magicPower, cooldown, duration)
      ]
    }
  }
}