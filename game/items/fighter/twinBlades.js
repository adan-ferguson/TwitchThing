export default function(level){
  return {
    effect: {
      stats: {
        basicAttacks: level
      }
    },
    orbs: 3 + level * 7
  }
}