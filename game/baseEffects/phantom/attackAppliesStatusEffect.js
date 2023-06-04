export default function(statusEffect = {}){
  return {
    abilities: [{
      trigger: 'attackHit',
      actions: [{
        applyStatusEffect: {
          targets: 'target',
          statusEffect
        }
      }]
    }]
  }
}