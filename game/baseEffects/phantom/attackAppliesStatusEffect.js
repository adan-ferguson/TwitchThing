export default function(statusEffect = {}){
  return {
    abilities: [{
      trigger: { attackHit: true },
      actions: [{
        applyStatusEffect: {
          target: 'target',
          statusEffect
        }
      }]
    }]
  }
}