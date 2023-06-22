import { describeStat } from '../components/common.js'

export function effectDisplayInfo(effectObj){
  const id = effectObj.effectId ?? effectObj.name
  return DEFS[id]?.(effectObj) ?? {}
}

const DEFS = {
  tasty: () => {
    return { description: 'When defeated, gain +1 food.' }
  },
  Sapling: () => {
    return { description: 'Block an incoming attack/ability.' }
  },
  brilliance: effectObj => {
    return {
      description: `Gain ${describeStat('magicPower')} equal to your ${describeStat('combatXP')}`
    }
  },
  diminishingReturns: () => {
    return {
      description: 'Stuns/sleeps/blinds/etc have diminishing returns.'
    }
  },
  disarmed: effectObj => {
    return {
      description: 'Item(s) disabled'
    }
  },
  sneakPast: effectObj => {
    console.log('a')
    const chance = effectObj.effect.stats.sneakChance
    const xp = effectObj.effect.stats.sneakXP.substring(1)
    return {
      description: `You have a ${chance} chance to sneak by non-boss monsters for ${xp} xp. If they're guarding a chest, you steal it.`
    }
  }
}