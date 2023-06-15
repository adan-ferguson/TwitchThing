import { describeStat, pluralize } from '../components/common.js'

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
  CCR: () => {
    return {
      description: 'Repeated stuns have diminishing returns.'
    }
  },
  disarmed: effectObj => {
    return {
      description: 'Item(s) disabled'
    }
  }
}