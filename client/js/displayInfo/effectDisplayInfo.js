import { toPct } from '../../../game/utilFunctions.js'
import { describeStat, statScaling } from '../components/common.js'
import EffectInstance from '../../../game/effectInstance.js'

export function effectDisplayInfo(effectObj){
  const id = effectObj.effectId ?? effectObj.name
  return DEFS[id]?.(effectObj.effect, effectObj instanceof EffectInstance ? effectObj : null) ?? {}
}

const DEFS = {
  // tasty: () => {
  //   return { description: 'When defeated, gain +1 food.' }
  // },
  // Sapling: () => {
  //   return { description: 'Block an incoming attack/ability.' }
  // },
  brilliance: (effect, effectInstance) => {
    return {
      description: `Gain ${describeStat('magicPower')} equal to ${effect.vars.ratio}x your ${describeStat('combatXP')}`
    }
  },
  // diminishingReturns: () => {
  //   return {
  //     description: 'Stuns/sleeps/blinds/etc have diminishing returns.'
  //   }
  // },
  // disarmed: effectObj => {
  //   return {
  //     description: 'Item(s) disabled'
  //   }
  // },
  // sneakPast: effectObj => {
  //   const chance = effectObj.effect.stats.sneakChance
  //   const xp = effectObj.effect.stats.sneakXP.substring(1)
  //   return {
  //     description: `You have a ${chance} chance to sneak by non-boss monsters for ${xp} xp. If they're guarding a chest, you steal it.`
  //   }
  // },
  // exhaustiveSearch: effectObj => {
  //   const multi = effectObj.effect.stats.leisurelyPaceMultiplier
  //   return {
  //     description: `When using Leisurely Pace, explore an extra ${multi} rooms per floor.`
  //   }
  // },
  senseWeakness: effect => {
    return {
      description: `Attacks deal <b>+${toPct(effect.stats.damagePerEnemyDebuff)}</b> damage for each debuff the target has. (Stacks don't count)`
    }
  },
  unstoppable: effect => {
    return {
      description: `Your minimum speed is ${effect.statsModifiers.speed.minValue}.`
    }
  },
  behemothCarapace: (effect, effectInstance = null) => {
    const scaling = statScaling({ hpMax: effect.stats.damageThreshold }, effectInstance)
    return {
      description: `You have a damage threshold equal to ${scaling}. Ignore incoming attack damage which is lower than this.`
    }
  }
}