export default function(level){
  return {
    orbs: level * 1,
    effect: {
      stats: {
        block: 0.04 + 0.04 * level
      }
    }
  }
}