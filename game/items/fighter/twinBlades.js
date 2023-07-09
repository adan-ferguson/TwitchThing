export default function(level){
  return {
    effect: {
      stats: {
        basicAttacks: level
      }
    },
    orbs: 4 + level * 7
  }
}