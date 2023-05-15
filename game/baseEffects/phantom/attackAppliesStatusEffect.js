export default function(statusEffect = {}){
  return {
    abilities: [{
      trigger: { attackHit: true },
      actions: [{
        applyStatusEffect: {
          affects: 'target',
          statusEffect
        }
      }]
    }]
  }
}