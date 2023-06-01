export default function(level){
  return {
    loadoutModifiers: {
      attached: {
        restrictions: {
          hasAbility: 'active'
        },
        levelUp: level
      }
    },
    effect: {
      tags: ['scroll']
    },
    orbs: 9 * level
  }
}