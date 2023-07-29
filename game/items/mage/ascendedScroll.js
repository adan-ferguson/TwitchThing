export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'ascensionScroll',
      subjectKey: 'attached',
      conditions: {
        hasAbility: 'active'
      },
      levelUp: level + 1
    }],
    effect: {
      tags: ['scroll']
    },
    orbs: 5 + 4 * level,
    displayName: 'Ascension Scroll'
  }
}