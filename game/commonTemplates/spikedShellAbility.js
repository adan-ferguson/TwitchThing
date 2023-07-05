export function spikedShellAbility(returnPct, damageType = 'phys'){
  return {
    trigger: 'hitByAttack',
    conditions: {
      data: {
        damageType: 'phys'
      }
    },
    actions: [{
      returnDamage: {
        damageType: 'phys',
        pct: returnPct
      }
    }]
  }
}