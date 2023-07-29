export function spikedShellAbility(returnPct, damageType = 'phys'){
  return {
    trigger: 'hitByAttack',
    conditions: {
      data: {
        damageType
      }
    },
    actions: [{
      returnDamage: {
        damageType,
        pct: returnPct
      }
    }]
  }
}