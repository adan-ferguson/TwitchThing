export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: 'attached',
        effect: {
          repetitions: level
        }
      }],
    },
    orbs: level * 10,
    vars: {
      targets: 'attached'
    }
  }
}