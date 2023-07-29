export default function(level){
  return {
    effect: {
      stats: {
        basicAttacks: level
      }
    },
    orbs: 5 + level * 6
  }
}