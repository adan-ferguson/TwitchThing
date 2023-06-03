export default function(level){
  return {
    effect: {
      tags: ['scroll']
    },
    loadoutModifiers: {
      attached: {
        levelUp: 1 + level
      }
    },
    orbs: 7 + 4 * level
  }
}