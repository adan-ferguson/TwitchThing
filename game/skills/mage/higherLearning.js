export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'higherLearning',
      subjectKey: 'all',
      conditions: {
        hasTag: 'scroll'
      },
      orbs: {
        mage: level * -2
      }
    }]
  }
}