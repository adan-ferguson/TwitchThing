export default function({ row = 0, col = 0 } = {}){
  return {
    name: 'disarmed',
    polarity: 'buff',
    statusEffectId: 'disarmed',
    metaEffects: [{
      metaEffectId: 'disabled',
      subjectKey: { row, col },
      effectModification: {
        exclusiveMods: [{
          disabled: true
        }]
      }
    }]
  }
}