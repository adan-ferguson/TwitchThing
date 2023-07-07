export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: {
          key: 'attached'
        },
        effectModification: {
          statMultiplier: 1 + level,
        }
      }]
    },
  }
}