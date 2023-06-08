export default function(level){
  return {
    orbs: level * 1,
    effect: {
      stats: {
        block: 0.05 + 0.05 * level
      }
    }
  }
}