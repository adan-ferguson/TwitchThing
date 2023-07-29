export function blockBarrierAction(actor, multiplier = 1){
  const block = actor.stats.get('block').value
  if(block){
    return {
      applyStatusEffect: {
        targets: 'self',
        statusEffect: {
          stackingId: 'block',
          polarity: 'buff',
          stacking: 'replace',
          name: 'block',
          barrier: {
            hp: Math.ceil(actor.hpMax * block) * multiplier
          }
        }
      }
    }
  }
  return null
}