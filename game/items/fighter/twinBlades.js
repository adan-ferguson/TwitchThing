export default function(level){
  return {
    effect: {
      stats: {
        basicAttacks: level
      }
    },
    orbs: -2 + level * 10
  }
}