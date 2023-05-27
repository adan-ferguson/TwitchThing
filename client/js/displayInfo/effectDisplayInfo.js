export function effectDisplayInfo(effectObj){
  const obj = effectObj.effect ?? effectObj
  return DEFS[obj.effectId ?? obj.name]?.(obj) ?? {}
}

const DEFS = {
  tasty: () => {
    return { description: 'When defeated, gain +1 food.' }
  },
  Sapling: () => {
    return { description: 'Block an incoming attack/ability.' }
  }
}