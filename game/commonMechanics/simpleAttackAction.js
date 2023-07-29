export function simpleAttackAction(damageType, scaling = 1, hits = 1){
  return {
    attack: {
      damageType,
      scaling: {
        [damageType + 'Power']: scaling
      },
      hits
    }
  }
}