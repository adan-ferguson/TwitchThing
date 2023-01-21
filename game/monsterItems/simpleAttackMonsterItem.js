import attackAction from '../actions/attackAction.js'
import { magicScalingMod } from '../mods/combined.js'

export default function simpleAttackMonsterItem(name, options = {}){

  options = {
    damageType: 'phys',
    damageMulti: 1,
    cooldown: null,
    initialCooldown: null,
    ...options
  }

  const mods = options.damageType === 'magic' ? [magicScalingMod] : []

  return {
    name,
    mods,
    abilities: {
      active: {
        cooldown: options.cooldown,
        initialCooldown: options.initialCooldown,
        actions: [
          attackAction({
            damageMulti: options.damageMulti,
            damageType: options.damageType
          })
        ]
      }
    }
  }
}