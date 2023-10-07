export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'ascensionScroll',
      subject: {
        key: 'attached'
      },
      conditions: {
        hasAbility: 'active'
      },
      levelUp: 1 + level * 2
    }],
    effect: {
      tags: ['scroll']
    },
    orbs: 5 + 5 * level,
    displayName: 'Ascension Scroll'
  }
}