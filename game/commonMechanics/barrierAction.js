export function barrierAction(scaledHp, def = {}){
  return {
    applyStatusEffect: {
      targets: 'self',
      statusEffect: {
        base: {
          barrier: {
            hp: {
              scaledNumber: scaledHp
            }
          }
        },
        ...def
      }
    }
  }
}