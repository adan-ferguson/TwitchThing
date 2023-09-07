export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'higherLearning',
      subject: {
        key: 'all'
      },
      conditions: {
        hasTag: 'scroll'
      },
      orbs: {
        mage: level * -2
      }
    }]
  }
}