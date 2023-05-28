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
  }
}