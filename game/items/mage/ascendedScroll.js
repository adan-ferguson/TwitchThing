export default function(level){
  return {
    loadoutModifiers: {
      attached: {
        restrictions: {
          hasAbility: 'active'
        },
        levelUp: level + 1
      }
    },
    effect: {
      tags: ['scroll']
    },
    orbs: 5 + 4 * level,
    displayName: 'Ascension Scroll'
  }
}