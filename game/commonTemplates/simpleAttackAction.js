export function simpleAttackAction(damageType, scaling = 1){
  return {
    attack: {
      damageType,
      scaling: {
        [damageType + 'Power']: scaling
      }
    }
  }
}