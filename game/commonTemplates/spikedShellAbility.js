export function spikedShellAbility(returnPct){
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
        pct: 0.12
      }
    }]
  }
}

// dealDamage: {
//   targets: 'enemy',
//     damageType: 'phys',
//     scaling: {
//     physPower: 0.12
//   }
// }