export function regenerationEffect(pct, initialCooldown = 5000){
  return {
    abilities: [{
      trigger: 'instant',
      initialCooldown,
      actions: [{
        gainHealth: {
          scaling: {
            hpMissing: pct
          }
        }
      }]
    }]
  }
}