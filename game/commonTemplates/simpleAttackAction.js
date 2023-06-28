export function simpleAttackAction(damageType, scaling){
  return {
    attack: {
      targets: 'enemy',
      damageType,
      scaling: {
        [damageType + 'Power']: scaling
      }
    }
  }
}