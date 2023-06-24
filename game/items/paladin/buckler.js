export default function(level){
  return {
    orbs: level * 1,
    effect: {
      stats: {
        block: 0.03 + 0.04 * level
      }
    }
  }
}